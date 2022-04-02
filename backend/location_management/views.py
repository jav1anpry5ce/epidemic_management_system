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
from django.utils import timezone
import datetime, calendar

from .models import Location, Offer, Test, Appointment
from .serializers import LocationSerializer, OfferSerializer, TestSerializer, AppointmentSerializer, CreateAppointmentSerializer, AvailabilitySerializer
from patient_management.serializers import CreatePatientSerializer, NextOfKinSerializer, RepresentativeSerializer
from patient_management.models import Patient, PositiveCase, DeathCase, RecoveredCase, HospitalizedCase
from testing.models import Testing
from vaccination.models import Vaccination
from inventory.models import LocationVaccine, Vaccine
from inventory.serializers import LocationVaccineSerializer, VaccineSerializer
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
            availability = AvailabilitySerializer(location.availability, many=True)
            res = {"Test": testSerializer.data, "Offer": offerSerializer.data, "Vaccine": vaccineSerializer.data, 'availability': availability.data}
            return Response(res, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_location_by_parish(request, parish):
    try:
        location = Location.objects.filter(parish=parish)
        serializer = LocationSerializer(location, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AppointmentView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        try:
            serializer = CreateAppointmentSerializer(data=request.data)
            if serializer.is_valid():
                if Patient.objects.filter(tax_number=request.data.get('tax_number')).exists():
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                else:
                    patient_serializer = CreatePatientSerializer(data=request.data)
                    if patient_serializer.is_valid():
                        kinSerializer = NextOfKinSerializer(data=request.data)
                        if kinSerializer.is_valid():
                            patient = patient_serializer.save()
                            kinSerializer.save(patient=patient)
                        else:
                            return Response(kinSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                rep_serializer = RepresentativeSerializer(data=request.data)
                if rep_serializer.is_valid():
                    if Patient.objects.filter(tax_number=request.data.get('tax_number')).exists():
                        patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                        rep_serializer.save(patient=patient)
                location = Location.objects.get(value=request.data.get('location'))
                if request.data.get('type') == "Testing":
                    try:
                        appointment = serializer.save(patient=patient, location=location)
                        Testing.objects.create(patient=patient, location=location, type=request.data.get('patient_choice'), appointment=appointment)
                    except:
                        appointment.delete()
                        return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                    appointment.location.availability.get(date=appointment.date, time=appointment.time).delete()
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    if not Appointment.objects.filter(patient=patient, status='Completed', type='Vaccination').count() >= 2 and not Vaccination.objects.filter(patient=patient, status='Completed').count() >= 3:
                        if not Vaccination.objects.filter(patient=patient, manufacture='Johnson & Johnson').count() > 0:
                            if not Appointment.objects.filter(patient=patient, status='Pending', type='Vaccination').count() > 0:
                                if Vaccination.objects.filter(patient=patient, status='Completed'):
                                    if Vaccination.objects.filter(patient=patient, status='Completed')[0].manufacture == request.data.get('patient_choice'):
                                        appointment = serializer.save(patient=patient, location=location)
                                        try:
                                            try:
                                                old_location = Vaccination.objects.filter(patient=patient, status='Completed')[0].location
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
                                            Vaccination.objects.create(patient=patient, location=location, manufacture=request.data.get('patient_choice'), appointment=appointment)
                                            appointment.location.availability.get(date=appointment.date, time=appointment.time).delete()
                                            return Response(status=status.HTTP_201_CREATED)
                                        except:
                                            appointment.delete()
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
                                        appointment = serializer.save(patient=patient, location=location)
                                        Vaccination.objects.create(patient=patient, location=location, manufacture=request.data.get('patient_choice'), appointment=appointment)
                                        appointment.location.availability.get(date=appointment.date, time=appointment.time).delete()
                                        return Response(status=status.HTTP_201_CREATED)
                                    except:
                                        appointment.delete()
                                        return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                            return Response({'Message': 'You already have an pending vaccination appointment!'}, status=status.HTTP_400_BAD_REQUEST)
                        return Response({'Message': 'You are all vaxxed up!'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'Message': 'You are all vaxxed up!'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      
        except:
            return Response({'Message': 'There was an error! Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def search_appointments(request, shorten_id):
    try:
        appointment = Appointment.objects.get(shorten_id=shorten_id)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

class AppointmentManagementView(APIView):
    def post(self, request):
        try:
            second_dose = False
            appointment = Appointment.objects.get(id=request.data.get('q'))
            serializer = AppointmentSerializer(appointment)
            if Vaccination.objects.filter(patient=appointment.patient, status="Completed").exists():
                second_dose = True
            return Response({'appointment': serializer.data, 'second_dose': second_dose}, status=status.HTTP_200_OK)
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
                                if Appointment.objects.filter(patient=appointment.patient, type='Vaccination', status='Completed').exists():
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
                        return Response({'Message': 'Something went wrong! Try again later'}, status=status.HTTP_400_BAD_REQUEST)
                    serializer = AppointmentSerializer(appointment)
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
                    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
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
                        serializer = AppointmentSerializer(appointment)
                        subject, from_email, to = 'Appointment Updated', 'donotreply@localhost', appointment.patient.email
                        html_content = f'''
                        <html>
                            <body>
                                <p>This is to notify that your appointment was successfully updated.</p>
                                <p>Appointment Date: {datetime.datetime.strptime(appointment.date, '%Y-%m-%d').strftime("%d %B, %Y")} <br />Appointment Time: {convertTime(appointment.time)} <br />Appointment Type: {appointment.type}</p>
                                <p>You can manage your appointment at <a href="{site}appointments/{appointment.id}">{site}appointments/{appointment.id}</a></p>
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
You can manage your appointment at {site}appointments/{appointment.id}
You can search for your appointment using the following code: {appointment.shorten_id}'''
                        send_sms(
                        text.strip(),
                        '+12065550100',
                        [f'{appointment.patient.phone},'],
                        fail_silently=True
                        )
                        appointment.location.availability.get(date=appointment.date, time=appointment.time).delete()
                        return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
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
    serializer_class = AppointmentSerializer
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filter_fields = {
        'status': ["in", "exact"],
    }
    pagination_class = CustomPageNumberPagination
    ordering = ['patient__tax_number']
    search_fields = ['patient__last_name', 'patient__tax_number']
    def get_queryset(self):
        status = self.request.GET.get('status')
        if status == None or status == 'Completed':
            return Appointment.objects.all()
        else:
            return Appointment.objects.filter(date=timezone.now())

        

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def check_in_patient(request, patient_id):
    try:
        appointment = Appointment.objects.get(id=patient_id)
        if request.user.location == appointment.location and request.user.can_check_in:
            if appointment.status == 'Pending':
                if appointment.date.strftime('%Y-%m-%d') == datetime.datetime.today().strftime('%Y-%m-%d'):
                    appointment.status = 'Checked In'
                    appointment.save()
                    return Response(status=status.HTTP_200_OK)
                return Response({'Message': 'This patient can not be checked in. Check the appointment date.'}, status=status.HTTP_403_FORBIDDEN)
            return Response({'Message': 'This appointment can not be updated!'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'Message': 'You are not authorized to check this patient in!'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def patient_vaccine(request):
    try:
        patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
        vaccine = Vaccination.objects.filter(patient=patient, status='Completed')
        next_dose = 0
        if vaccine[0].manufacture == "Moderna":
            next_dose = 4
        elif vaccine[0].manufacture == "Pfizer":
            next_dose = 3
        elif vaccine[0].manufacture == "AstraZeneca":
            next_dose = 8
        res = [{
            'value': vaccine[0].manufacture, 
            'date_given': vaccine[0].date_given, 
            'next_dose': next_dose
            }]
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
            return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to create a location'}, status=status.HTTP_401_UNAUTHORIZED)

def returnDate (year, month):
    num_days = calendar.monthrange(year, month)[1]
    days = [datetime.date(year, month, day) for day in range(1, num_days + 1)]
    return days

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_positive_cases(request):
    if request.user.is_moh_staff:
        excludes = ['Dead', 'Recovered']
        year = request.GET.get('year')
        month = request.GET.get('month')
        dates = returnDate(int(year), int(month))
        total = 0
        positive_cases_for_month = []
        for date in dates:
            positive_cases = PositiveCase.objects.filter(date_tested=date).exclude(status__in=excludes).count()
            case_data = {
                "date": date.strftime("%b-%d"),
                "count": positive_cases
            }
            total += positive_cases
            positive_cases_for_month.append(case_data)
        return Response({'Data': positive_cases_for_month, 'total': total}, status=status.HTTP_200_OK)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_hospitalized(request):
    if request.user.is_moh_staff:
        year = request.GET.get('year')
        month = request.GET.get('month')
        dates = returnDate(int(year), int(month))
        total = 0
        hospitalized_cases_for_month = []
        for date in dates:
            hospitalized_cases = HospitalizedCase.objects.filter(hospitalized_date=date).count()
            case_data = {
                "date": date.strftime("%b-%d"),
                "count": hospitalized_cases
            }
            total += hospitalized_cases
            hospitalized_cases_for_month.append(case_data)
        return Response({'Data': hospitalized_cases_for_month, 'total': total}, status=status.HTTP_200_OK)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_death(request):
    if request.user.is_moh_staff:
        year = request.GET.get('year')
        month = request.GET.get('month')
        dates = returnDate(int(year), int(month))
        total = 0
        death_cases_for_month = []
        for date in dates:
            death_cases = DeathCase.objects.filter(death_date=date).count()
            case_data = {
                "date": date.strftime("%b-%d"),
                "count": death_cases
            }
            total += death_cases
            death_cases_for_month.append(case_data)
        return Response({'Data': death_cases_for_month, 'total': total}, status=status.HTTP_200_OK)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_recovered(request):
    if request.user.is_moh_staff:
        year = request.GET.get('year')
        month = request.GET.get('month')
        dates = returnDate(int(year), int(month))
        total = 0
        recovered_cases_for_month = []
        for date in dates:
            recovered_cases = RecoveredCase.objects.filter(recovery_date=date).count()
            case_data = {
                "date": date.strftime("%b-%d"),
                "count": recovered_cases
            }
            total += recovered_cases
            recovered_cases_for_month.append(case_data)
        return Response({'Data': recovered_cases_for_month, 'total': total}, status=status.HTTP_200_OK)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_test_administered(request):
    if request.user.is_moh_staff or request.user.is_staff:
        year = request.GET.get('year')
        month = request.GET.get('month')
        dates = returnDate(int(year), int(month))
        total = 0
        test_administered_for_month = []
        for date in dates:
            if request.user.is_moh_staff:
                test_administered = Testing.objects.filter(status='Completed', date=date).count()
            else: test_administered = Testing.objects.filter(status='Completed', date=date, location=request.user.location).count()
            case_data = {
                "date": date.strftime("%b-%d"),
                "count": test_administered
            }
            total += test_administered
            test_administered_for_month.append(case_data)
        return Response({'Data': test_administered_for_month, 'total': total}, status=status.HTTP_200_OK)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_vaccine_administered(request):
    if request.user.is_moh_staff or request.user.is_staff:
        year = request.GET.get('year')
        month = request.GET.get('month')
        dates = returnDate(int(year), int(month))
        total = 0
        vaccine_administered_for_month = []
        for date in dates:
            if request.user.is_moh_staff:
                vaccine_administered = Vaccination.objects.filter(status='Completed', date_given=date).count()
            else: vaccine_administered = Vaccination.objects.filter(status='Completed', date_given=date, location=request.user.location).count()
            case_data = {
                "date": date.strftime("%b-%d"),
                "count": vaccine_administered
            }
            total += vaccine_administered
            vaccine_administered_for_month.append(case_data)
        return Response({'Data': vaccine_administered_for_month, 'total': total}, status=status.HTTP_200_OK)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_breakdown(request):
    if request.user.is_moh_staff:
        try:
            locations = Location.objects.all()
            number_of_pfizer = Vaccine.objects.get(value='Pfizer').number_of_dose
            number_of_moderna = Vaccine.objects.get(value='Moderna').number_of_dose
            number_of_JJ = Vaccine.objects.get(value='Johnson & Johnson').number_of_dose
            number_of_AZ = Vaccine.objects.get(value='AstraZeneca').number_of_dose
            number_of_locations = locations.count()
            pfizer_to_disb = Vaccine.objects.get(value='Pfizer').number_of_dose
            moderna_to_disb = Vaccine.objects.get(value='Moderna').number_of_dose
            JJ_to_disb = Vaccine.objects.get(value='Johnson & Johnson').number_of_dose
            AZ_to_disb = Vaccine.objects.get(value='AstraZeneca').number_of_dose
            
            for location in locations:
                pfizers = LocationVaccine.objects.filter(location=location, value='Pfizer')
                modernas = LocationVaccine.objects.filter(location=location, value='Moderna')
                JJs = LocationVaccine.objects.filter(location=location, value='Johnson & Johnson')
                AZs = LocationVaccine.objects.filter(location=location, value='AstraZeneca')
                for pfizer in pfizers:
                    number_of_pfizer += pfizer.number_of_dose
                for moderna in modernas:
                    number_of_moderna += moderna.number_of_dose
                for jj in JJs:
                    number_of_JJ += jj.number_of_dose
                for az in AZs:
                    number_of_AZ += az.number_of_dose
                
            general_breakdown = {
                'pfizer_to_disb': pfizer_to_disb,
                'moderna_to_disb': moderna_to_disb,
                'JJ_to_disb': JJ_to_disb,
                'AZ_to_disb': AZ_to_disb,
                'pfizer_in_stock':number_of_pfizer,
                'moderna_in_stock':number_of_moderna,
                'JJ_in_stock':number_of_JJ,
                'AZ_in_stock': number_of_AZ,
                'number_of_locations':number_of_locations,
            }
            return Response(general_breakdown ,status=status.HTTP_200_OK)
        except:
            return Response({'Message': 'No data was returned.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_inventory(request):
    if request.user.is_moh_staff:
        try:
            locations = Location.objects.all()
            pfizer_stock = Vaccine.objects.get(value='Pfizer').number_of_dose
            moderna_stock = Vaccine.objects.get(value='Moderna').number_of_dose
            JJ_stock = Vaccine.objects.get(value='Johnson & Johnson').number_of_dose
            AZ_stock = Vaccine.objects.get(value='AstraZeneca').number_of_dose

            for location in locations:
                pfizers = LocationVaccine.objects.filter(location=location, value='Pfizer')
                modernas = LocationVaccine.objects.filter(location=location, value='Moderna')
                JJs = LocationVaccine.objects.filter(location=location, value='Johnson & Johnson')
                AZs = LocationVaccine.objects.filter(location=location, value='AstraZeneca')
                for pfizer in pfizers:
                    pfizer_stock += pfizer.number_of_dose
                for moderna in modernas:
                    moderna_stock += moderna.number_of_dose
                for jj in JJs:
                    JJ_stock += jj.number_of_dose
                for az in AZs:
                    AZ_stock += az.number_of_dose
            data = [
                {
                'vaccine': 'Pfizer',
                'number_of_dose':pfizer_stock,
                },
                {
                'vaccine': 'Moderna',
                'number_of_dose':moderna_stock,
                },
                {
                'vaccine': 'Johnson & Johnson',
                'number_of_dose':JJ_stock,
                },
                {
                'vaccine': 'AstraZeneca',
                'number_of_dose':AZ_stock,
                },
            ]
            return Response(data ,status=status.HTTP_200_OK)
        except:
            return Response({'Message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def location_breakdown(request):
    try:
        pfizer_in_stock = None
        moderna_in_stock = None
        jj_in_stock = None
        az_in_stock = None
        vaccines_administer = None
        location = request.user.location
        number_of_tests = Testing.objects.filter(location=location, status='Completed').count()
        pending_appointments = Appointment.objects.filter(location=location, status='pending').count()
        offer_testing = Offer.objects.filter(value='Testing', location=location).exists()
        offer_vaccines = Offer.objects.filter(value='Vaccination', location=location).exists()
        if Offer.objects.filter(location=location, value='Vaccination').exists():
            vaccines_administer = Vaccination.objects.filter(location=location, status='Completed').count()
            if LocationVaccine.objects.filter(location=location, value='Pfizer').exists():
                pfizer_in_stock = LocationVaccine.objects.get(location=location, value='Pfizer').number_of_dose
            if LocationVaccine.objects.filter(location=location, value='Moderna').exists():
                moderna_in_stock = LocationVaccine.objects.get(location=location, value='Moderna').number_of_dose
            if LocationVaccine.objects.filter(location=location, value='Johnson & Johnson').exists():
                jj_in_stock = LocationVaccine.objects.get(location=location, value='Johnson & Johnson').number_of_dose
            if LocationVaccine.objects.filter(location=location, value='AstraZeneca').exists():
                az_in_stock = LocationVaccine.objects.get(location=location, value='AstraZeneca').number_of_dose
        res = {
            'number_of_tests': number_of_tests,
            'vaccines_administer': vaccines_administer,
            'pending_appointments': pending_appointments,
            'pfizer_in_stock': pfizer_in_stock,
            'moderna_in_stock':moderna_in_stock,
            'jj_in_stock': jj_in_stock,
            'az_in_stock': az_in_stock,
            'offer_testing': offer_testing,
            'offer_vaccines': offer_vaccines
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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_availability(request):
    serializer = AvailabilitySerializer(data=request.data)
    if serializer.is_valid():
        time = serializer.initial_data['time']
        date = serializer.initial_data['date']
        if not request.user.location.availability.filter(date=date, time=time).exists():
            availability = serializer.save()
            request.user.location.availability.add(availability)
            return Response({'Message': 'Date added!'}, status=status.HTTP_201_CREATED)
        return Response({'Message': 'This date and time already exists!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetAvailability(ListAPIView):
    serializer_class = AvailabilitySerializer
    filter_backends = [filterss.DjangoFilterBackend, filters.OrderingFilter,]
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['date']

    def get_queryset(self):
        return self.request.user.location.availability.all()

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_availability(request, id):
    try:
        request.user.location.availability.get(id=id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except:
        return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)