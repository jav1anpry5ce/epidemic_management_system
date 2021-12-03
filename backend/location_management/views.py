from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.models import Site
from django.db.models import Case, When
from functions import convertTime
from sms import send_sms
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django_filters import rest_framework as filterss
import datetime

from .models import Location, Offer, Test, Appointment
from .serializers import LocationSerializer, OfferSerializer, TestSerializer, AppointmentSerializer, CreateAppointmentSerializer
from patient_management.serializers import CreatePatientSerializer, NextOfKinSerializer, RepresentativeSerializer
from patient_management.models import Patient, PositiveCase
from testing.models import Testing
from vaccination.models import Vaccination
from inventory.models import LocationVaccine, Vaccine
from inventory.serializers import LocationVaccineSerializer
from testing.serializers import getTestSerializer

site = Site.objects.get_current()

class LocationView(APIView):
    def get(self, request):
        try:
            location = Location.objects.all()
            serializer = LocationSerializer(location, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            location = Location.objects.get(value=request.data.get('value'))
            offer = Offer.objects.filter(location=location)
            test = Test.objects.filter(location=location)
            vaccine = LocationVaccine.objects.filter(location=location, number_of_dose__gte=Case(When(value='Johnson & Johnson', then=1), default=2))
            offerSerializer = OfferSerializer(offer, many=True)
            testSerializer = TestSerializer(test, many=True)
            vaccineSerializer = LocationVaccineSerializer(vaccine, many=True)
            res = {"Test": testSerializer.data, "Offer": offerSerializer.data, "Vaccine": vaccineSerializer.data}
            return Response(res, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_location_by_parish(request, parish):
    try:
        location = Location.objects.filter(parish=parish)
        seraializer = LocationSerializer(location, many=True)
        return Response(seraializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AppointmentView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        try:
            seraializer = CreateAppointmentSerializer(data=request.data)
            if seraializer.is_valid():
                if Patient.objects.filter(tax_number=request.data.get('tax_number')).exists():
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                else:
                    patient_seraializer = CreatePatientSerializer(data=request.data)
                    if patient_seraializer.is_valid():
                        kinSerializer = NextOfKinSerializer(data=request.data)
                        if kinSerializer.is_valid():
                            patient_seraializer.save()
                            patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                            kinSerializer.save(patient=patient)
                        else:
                            return Response(kinSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response(patient_seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
                rep_serializer = RepresentativeSerializer(data=request.data)
                if rep_serializer.is_valid():
                    if Patient.objects.filter(tax_number=request.data.get('tax_number')).exists():
                        patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                        rep_serializer.save(patient=patient)
                location = Location.objects.get(value=request.data.get('location'))
                if request.data.get('type') == "Testing":
                    try:
                        seraializer.save(patient=patient, location=location)
                        aid = seraializer.data['id']
                        appointment = Appointment.objects.get(id=aid)
                        Testing.objects.create(patient=patient, location=location, type=request.data.get('patient_choice'), appointment=appointment)
                    except:
                        appointment = Appointment.objects.get(id=aid).delete()
                        return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    if not Appointment.objects.filter(patient=patient, status='Completed', type='Vaccination').count() >= 2 and not Vaccination.objects.filter(patient=patient, status='Completed').count() >= 2:
                        if not Vaccination.objects.filter(patient=patient, manufacture='Johnson & Johnson').count() > 0:
                            if not Appointment.objects.filter(patient=patient, status='Pending', type='Vaccination').count() > 0:
                                if Vaccination.objects.filter(patient=patient, status='Completed'):
                                    if Vaccination.objects.get(patient=patient, status='Completed').manufacture == request.data.get('patient_choice'):
                                        try:
                                            try:
                                                old_location = Vaccination.objects.get(patient=patient, status='Completed').location
                                                if old_location != location:
                                                    old_vaccines = LocationVaccine.objects.get(location=old_location, value=request.data.get('patient_choice'))
                                                    old_vaccines.number_of_dose += 1
                                                    old_vaccines.save()
                                                    new_vaccines = LocationVaccine.objects.get(location=location, value=request.data.get('patient_choice'))
                                                    new_vaccines.number_of_dose -= 1
                                                    new_vaccines.save()
                                            except:
                                                old_vaccines -= 1
                                                old_vaccines.save()
                                                return Response({'Message': 'Something went wrong! Try again later'}, status=status.HTTP_400_BAD_REQUEST)
                                            seraializer.save(patient=patient, location=location)
                                            aid = seraializer.data['id']
                                            appointment = Appointment.objects.get(id=aid)
                                            Vaccination.objects.create(patient=patient, location=location, manufacture=request.data.get('patient_choice'), appointment=appointment)
                                            return Response(status=status.HTTP_201_CREATED)
                                        except:
                                            appointment = Appointment.objects.get(id=aid).delete()
                                            return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                                    return Response({'Message': f'Having two different type of vaccines has not been tested. Please select {Vaccination.objects.filter(patient=patient, status="Completed")[0].manufacture} as your vaccine choice.'}, status=status.HTTP_400_BAD_REQUEST)
                                else:
                                    try:
                                        try:
                                            vaccines = LocationVaccine.objects.get(location=location, value=request.data.get('patient_choice'))
                                            if request.data.get('patient_choice') == 'Johnson & Johnson':
                                                vaccines.number_of_dose -= 1
                                            else:
                                                vaccines.number_of_dose -= 2
                                            vaccines.save()
                                        except:

                                            return Response({'Message': 'Something went wrong! Try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                                        seraializer.save(patient=patient, location=location)
                                        aid = seraializer.data['id']
                                        appointment = Appointment.objects.get(id=aid)
                                        Vaccination.objects.create(patient=patient, location=location, manufacture=request.data.get('patient_choice'), appointment=appointment)
                                        return Response(status=status.HTTP_201_CREATED)
                                    except:
                                        appointment = Appointment.objects.get(id=aid).delete()
                                        return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                            return Response({'Message': 'You already have an pending vaccination appointment!'}, status=status.HTTP_400_BAD_REQUEST)
                        return Response({'Message': 'You are all vaxxed up!'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'Message': 'You are all vaxxed up!'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)      
        except:
            return Response({'Message': 'There was an error! Please try again later.'}, status=status.HTTP_400_HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def search_appointments(request, shorten_id):
    try:
        appointment = Appointment.objects.get(shorten_id=shorten_id)
        seraializer = AppointmentSerializer(appointment)
        return Response(seraializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

class AppointmentManagementView(APIView):
    def post(self, request):
        try:
            second_dose = False
            appointment = Appointment.objects.get(id=request.data.get('q'))
            seraializer = AppointmentSerializer(appointment)
            try:
                if Vaccination.objects.get(patient=appointment.patient, status='Completed'):
                    second_dose = True
            except:
                second_dose = False
            return Response({'appointment': seraializer.data, 'second_dose': second_dose}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            if request.data.get('request') == 'Cancel':
                try:
                    appointment = Appointment.objects.get(id=request.data.get('id'))
                    appointment.status = 'Cancelled'
                    appointment.save()
                    try:
                        if appointment.type == 'Vaccination':
                            if appointment.patient_choice == 'Johnson & Johnson':
                                vaccines = LocationVaccine.objects.get(location=appointment.location, value=appointment.patient_choice)
                                vaccines.number_of_dose += 1
                                vaccines.save()
                            else:
                                try:
                                    if Appointment.objects.get(patient=appointment.patient, type='Vaccination', status='Completed'):
                                        completed_vaccination = Appointment.objects.get(patient=appointment.patient, type='Vaccination', status='Completed')
                                        if (appointment.location != completed_vaccination.location):
                                            vaccines = LocationVaccine.objects.get(location=appointment.location, value=appointment.patient_choice)
                                            vaccines.number_of_dose += 1
                                            vaccines.save()
                                            vaccines = LocationVaccine.objects.get(location=completed_vaccination.location, value=completed_vaccination.patient_choice)
                                            vaccines.number_of_dose -= 1
                                            vaccines.save()
                                    else:
                                        vaccines = LocationVaccine.objects.get(location=appointment.location, value=appointment.patient_choice)
                                        vaccines.number_of_dose += 2
                                        vaccines.save()     
                                except:
                                    vaccines = LocationVaccine.objects.get(location=appointment.location, value=appointment.patient_choice)
                                    vaccines.number_of_dose += 2
                                    vaccines.save()
                    except:
                        return Response({'Message': 'Something went wrong! Try again later'}, status=status.HTTP_400_BAD_REQUEST)
                    seraializer = AppointmentSerializer(appointment)
                    subject, from_email, to = 'Cancelled Appointment', 'donotreply@localhost', appointment.patient.email
                    html_content = f'''
                    <html>
                        <body>
                            <p>This is to notify that your appoinntment for {appointment.date.strftime('%d %B, %Y')} at {convertTime(appointment.time)} was successfully cancelled!</p>
                        </body>
                    </html>
                    '''
                    text_content = ""
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.content_subtype = "html"
                    msg.send()
                    text = f'''This is to notify that your appoinntment for {appointment.date.strftime('%d %B, %Y')} at {convertTime(appointment.time)} was successfully cancelled!'''
                    send_sms(
                    text.strip(),
                    '+12065550100',
                    [f'{appointment.patient.phone},'],
                    fail_silently=True
                    )
                    return Response(seraializer.data, status=status.HTTP_202_ACCEPTED)
                except:
                    return Response({'Message': "It's not you It's us!"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                appointment = Appointment.objects.get(id=request.data.get('id'))
                date = appointment.date
                time = appointment.time
                if not str(date) == str(request.data.get('date')) or not str(time) == str(request.data.get('time')) or not appointment.patient_choice == request.data.get('patient_choice'):
                    try:
                        appointment.date = request.data.get('date')
                        appointment.time = request.data.get('time')
                        appointment.patient_choice = request.data.get('patient_choice')
                        appointment.save()
                        seraializer = AppointmentSerializer(appointment)
                        subject, from_email, to = 'Appointment Updated', 'donotreply@localhost', appointment.patient.email
                        html_content = f'''
                        <html>
                            <body>
                                <p>This is to notify that your appointment was successfully updated.</p>
                                <p>Appointment Date: {datetime.datetime.strptime(appointment.date, '%Y-%m-%d').strftime("%d %B, %Y")} <br />Appointment Time: {convertTime(appointment.time)} <br />Appointment Type: {appointment.type}</p>
                                <p>You can manage your appointment at <a href="{site}appointment/management/{appointment.id}">{site}appointment/management/{appointment.id}</a></p>
                                <p>You can search for your appointment using the following code: {appointment.shorten_id}</p>
                            </body>
                        </html>
                        '''
                        text_content = ""
                        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                        msg.attach_alternative(html_content, "text/html")
                        msg.content_subtype = "html"
                        msg.send()
                        text = f'''This is to notify that your appointment was successfully updated.
Appointment Date: {datetime.datetime.strptime(appointment.date, '%Y-%m-%d').strftime("%d %B, %Y")}
Appointment Time: {convertTime(appointment.time)}
Appointment Type: {appointment.type}
You can manage your appointment at {site}appointment/management/{appointment.id}
You can search for your appointment using the following code: {appointment.shorten_id}'''
                        send_sms(
                        text.strip(),
                        '+12065550100',
                        [f'{appointment.patient.phone},'],
                        fail_silently=True
                        )
                        return Response(seraializer.data,status=status.HTTP_202_ACCEPTED)
                    except:
                        return Response({'Message': "It's not you It's us!"}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'Message': 'Appointment date or time must be different to rescheduled.'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'pageSize'

class UserFiltering(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_authenticated:
                return queryset.filter(location=request.user.location)

class LocationAppointments(ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filter_fields = {
        'status': ["in", "exact"],
    }
    pagination_class = CustomPageNumberPagination
    ordering = ['patient__tax_number']
    search_fields = ['patient__last_name', 'patient__tax_number']

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def check_in_patient(request, patient_id):
    try:
        appointment = Appointment.objects.get(id=patient_id)
        if request.user.location == appointment.location and request.user.can_check_in:
            if appointment.status == 'Pending':
                appointment.status = 'Checked In'
                appointment.save()
                return Response(status=status.HTTP_200_OK)
            return Response({'Message': 'This appointment can not be updated!'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'Message': 'You are not authorized to check this patient in!'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        seraializer = AppointmentSerializer(appointment)
        return Response(seraializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def patient_vaccine(request):
    try:
        patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
        vaccine = Vaccination.objects.get(patient=patient, status='Completed')
        res = [{'value': vaccine.manufacture, 'label': vaccine.manufacture, 'role': "Master"}]
        return Response(res, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def breakdown(request):
    try:
        if request.user.is_moh_staff:
            locations = Location.objects.all()
            location_list = []
            for location in locations:
                vaccines = LocationVaccine.objects.filter(location=location)
                number_of_tests = Testing.objects.filter(location=location, status='Completed').count()
                vaccines_administer = Vaccination.objects.filter(location=location, status='Completed').count()
                pending_appointments = Appointment.objects.filter(location=location, status='pending').count()
                number_of_vaccine = 0
                for vaccine in vaccines:
                    number_of_vaccine += vaccine.number_of_dose
                location_dict = {
                    'name': location.value,
                    'pending_appointments': pending_appointments,
                    'number_of_vaccine': number_of_vaccine,
                    'tests_administer': number_of_tests,
                    'vaccines_administer': vaccines_administer,
                    'city': location.city,
                    'parish': location.parish,
                }
                location_list.append(location_dict)
                paginator = CustomPageNumberPagination()
                result_page = paginator.paginate_queryset(location_list, request)
            return paginator.get_paginated_response(result_page)
            # return Response(location_list, status=status.HTTP_200_OK)
        return Response({'Message': 'You are unauthorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_location(request):
    if request.user.is_moh_admin:
        try:
            if request.data.get('location_name'):
                if request.data.get('street_address'):
                    if request.data.get('city'):
                        if request.data.get('parish'):
                            if request.data.get('offer'):
                                location = Location.objects.create(label=request.data.get('location_name'), value=request.data.get('location_name'), street_address=request.data.get('street_address'), city=request.data.get('city'), parish=request.data.get('parish'))
                                offer = request.data.get('offer')
                                try:
                                    if offer['vaccination'] == 1:
                                        Offer.objects.create(location=location, label='Vaccination', value='Vaccination')
                                    if offer['testing']['testing'] == 1:
                                        Offer.objects.create(location=location, label='Testing', value='Testing')
                                        for test in offer['testing']['tests']:
                                            if test['selected']:
                                                Test.objects.create(location=location, label=test['name'], value=test['name'], type=test['name'])
                                except:
                                    return Response({'Message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
                                return Response({'Message': 'Location created successfully.'}, status=status.HTTP_201_CREATED)
                            return Response({'Message': 'Please provide what this location offer'}, status=status.HTTP_400_BAD_REQUEST)
                        return Response({'Message': 'Please provide a parish'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'Message': 'Please provide a city'}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'Message': 'Please provide a street address'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'Please provide a location name'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to create a location'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_breakdown(request):
    if request.user.is_moh_staff:
        try:
            excludes = ['Dead', 'Recovered']
            locations = Location.objects.all()
            number_of_pfizer = Vaccine.objects.get(value='Pfizer').number_of_dose
            number_of_moderna = Vaccine.objects.get(value='Moderna').number_of_dose
            number_of_JJ = Vaccine.objects.get(value='Johnson & Johnson').number_of_dose
            positive_cases = PositiveCase.objects.exclude(status__in=excludes).count()
            hospitalized = PositiveCase.objects.filter(status='Hospitalized').count()
            death = PositiveCase.objects.filter(status='Dead').count()
            recovered = PositiveCase.objects.filter(status='Recovered').count()
            number_of_locations = locations.count()
            test_count = Testing.objects.filter(status='Completed').count()
            vaccines_administer = Vaccination.objects.filter(status='Completed').count()
            pfizer_to_disb = Vaccine.objects.get(value='Pfizer').number_of_dose
            moderna_to_disb = Vaccine.objects.get(value='Moderna').number_of_dose
            JJ_to_disb = Vaccine.objects.get(value='Johnson & Johnson').number_of_dose
            
            for location in locations:
                pfizers = LocationVaccine.objects.filter(location=location, value='Pfizer')
                modernas = LocationVaccine.objects.filter(location=location, value='Moderna')
                JJs = LocationVaccine.objects.filter(location=location, value='Johnson & Johnson')
                for pfizer in pfizers:
                    number_of_pfizer += pfizer.number_of_dose
                for moderna in modernas:
                    number_of_moderna += moderna.number_of_dose
                for jj in JJs:
                    number_of_JJ += jj.number_of_dose
                
            general_breakdown = {
                'pfizer_to_disb': pfizer_to_disb,
                'moderna_to_disb': moderna_to_disb,
                'JJ_to_disb': JJ_to_disb,
                'pfizer_in_stock':number_of_pfizer,
                'moderna_in_stock':number_of_moderna,
                'JJ_in_stock':number_of_JJ,
                'positive_cases':positive_cases,
                'number_of_locations':number_of_locations,
                'vaccines_administer': vaccines_administer,
                'test_count':test_count,
                'hospitalized': hospitalized,
                'recovered': recovered,
                'death': death,
            }
            return Response(general_breakdown ,status=status.HTTP_200_OK)
        except:
            return Response({'Message': 'Something went wrong.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def location_breakdown(request):
    try:
        pfizer_in_stock = None
        moderna_in_stock = None
        jj_in_stock = None
        vaccines_administer = None
        location = request.user.location
        number_of_tests = Testing.objects.filter(location=location, status='Completed').count()
        pending_appointments = Appointment.objects.filter(location=location, status='pending').count()
        if Offer.objects.filter(location=location, value='Vaccination').exists():
            vaccines_administer = Vaccination.objects.filter(location=location, status='Completed').count()
            if LocationVaccine.objects.filter(location=location, value='Pfizer').exists():
                pfizer_in_stock = LocationVaccine.objects.get(location=location, value='Pfizer').number_of_dose
            if LocationVaccine.objects.filter(location=location, value='Moderna').exists():
                moderna_in_stock = LocationVaccine.objects.get(location=location, value='Moderna').number_of_dose
            if LocationVaccine.objects.filter(location=location, value='Johnson & Johnson').exists():
                jj_in_stock = LocationVaccine.objects.get(location=location, value='Johnson & Johnson').number_of_dose
        res = {
            'number_of_tests': number_of_tests,
            'vaccines_administer': vaccines_administer,
            'pending_appointments': pending_appointments,
            'pfizer_in_stock': pfizer_in_stock,
            'moderna_in_stock':moderna_in_stock,
            'jj_in_stock': jj_in_stock,
        }
        return Response(res, status=status.HTTP_200_OK)
    except:
        return Response({'Message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class SearchFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(location=request.user.location, status='Pending', appointment__status='Checked In')


class CheckedIn(ListAPIView):
    serializer_class = getTestSerializer
    filter_backends = [SearchFilter, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering = ['patient__tax_number']
    search_fields = ['patient__last_name', 'patient__tax_number']
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.kwargs['type'] == 'Testing':
            return Testing.objects.all()
        elif self.kwargs['type'] == 'Vaccination':
            return Vaccination.objects.all()
        else:
            return None
