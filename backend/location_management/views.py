from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.models import Site
from django.db.models import Case, When, Q
import pyqrcode
from functions import removeFile
from functions import convertTime

from .models import Location, Offer, Test, Appointment
from .serializers import LocationSerializer, OfferSerializer, TestSerializer, AppointmentSerializer, CreateAppointmentSerializer
from patient_management.serializers import CreatePatientSerializer, NextOfKinSerializer
from patient_management.models import Patient, PositiveCase, NextOfKin
from testing.models import Testing
from vaccination.models import Vaccination
from inventory.models import LocationVaccine, Vaccine
from inventory.serializers import LocationVaccineSerializer

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
            try:
                seraializer = CreateAppointmentSerializer(data=request.data)
                if seraializer.is_valid():
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                    location = Location.objects.get(value=request.data.get('location'))
                    if request.data.get('type') == "Testing":
                        try:
                            seraializer.save(patient=patient, location=location)
                            aid = seraializer.data['id']
                            date = seraializer.data['date']
                            time = seraializer.data['time']
                            appointment = Appointment.objects.get(id=aid)
                            test = Testing.objects.create(patient=patient, location=location, type=request.data.get('patient_choice'), appointment=appointment)
                            qr = pyqrcode.create(str(test.testing_id))
                            qr.png(f'qr_codes/{aid}.png', scale = 8)
                            src = f'qr_codes/{aid}.png'
                            subject, from_email, to = 'Appointment for COVID-19 Test', 'donotreply@localhost', patient.email
                            html_content = f'''
                            <html>
                                <body>
                                    <p>Your appointment for your COVID-19 test was successfully made for {date} at {convertTime(time)}.</p>
                                    <p>You can manage your appointmnet at <a href="{site}appointment/management/{aid}">{site}appointment/management/{aid}</a></p>
                                    <img src="{src} />
                                </body>
                            </html>
                            '''
                            text_content = ''
                            msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                            msg.attach_alternative(html_content, "text/html")
                            msg.content_subtype = 'html'
                            msg.attach_file(src)
                            msg.send()
                        except:
                            removeFile(src)
                            appointment = Appointment.objects.get(id=aid).delete()
                            return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                        return Response(status=status.HTTP_201_CREATED)
                    else:
                        if not len(Appointment.objects.filter(patient=patient, status='Completed', type='Vaccination')) >= 2 and not len(Vaccination.objects.filter(patient=patient, status='Completed')) >= 2:
                            if not len(Vaccination.objects.filter(patient=patient, manufacture='Johnson & Johnson')) > 0:
                                if not len(Appointment.objects.filter(patient=patient, status='Pending', type='Vaccination')) > 0:
                                    if Vaccination.objects.filter(patient=patient, status='Completed'):
                                        if Vaccination.objects.get(patient=patient, status='Completed').manufacture == request.data.get('patient_choice'):
                                            try:
                                                try:
                                                    old_location = Vaccination.objects.get(patient=patient, status='Completed').location
                                                    if old_location != location:
                                                        vaccines = LocationVaccine.objects.get(location=old_location, value=request.data.get('patient_choice'))
                                                        vaccines.number_of_dose += 1
                                                        vaccines.save()
                                                        vaccines = LocationVaccine.objects.get(location=location, value=request.data.get('patient_choice'))
                                                        vaccines.number_of_dose -= 1
                                                        vaccines.save()
                                                except:
                                                    return Response({'Message': 'Something went wrong! Try again later'}, status=status.HTTP_400_BAD_REQUEST)
                                                seraializer.save(patient=patient, location=location)
                                                aid = seraializer.data['id']
                                                date = seraializer.data['date']
                                                time = seraializer.data['time']
                                                appointment = Appointment.objects.get(id=aid)
                                                vac = Vaccination.objects.create(patient=patient, location=location, manufacture=request.data.get('patient_choice'), appointment=appointment)
                                                qr = pyqrcode.create(str(vac.vaccination_id))
                                                qr.png(f'qr_codes/{aid}.png', scale = 8)
                                                src = f'qr_codes/{aid}.png'
                                                subject, from_email, to = 'Appointment for COVID-19 Vaccine', 'donotreply@localhost', patient.email
                                                html_content = f'''
                                                <html>
                                                    <body>
                                                        <p>Your appointment for your {vac.manufacture} vaccine was successfully made for {date} at {convertTime(time)}.</p>
                                                        <p>You can manage your appointment at <a href="{site}appointment/management/{aid}">{site}appointment/management/{aid}</a></p>
                                                    </body>
                                                </html>
                                                '''
                                                text_content = ""
                                                msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                                                msg.attach_alternative(html_content, "text/html")
                                                msg.content_subtype = "html"
                                                msg.attach_file(src)
                                                msg.send()
                                                return Response(status=status.HTTP_201_CREATED)
                                            except:
                                                removeFile(src)
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
                                            date = seraializer.data['date']
                                            time = seraializer.data['time']
                                            appointment = Appointment.objects.get(id=aid)
                                            vac = Vaccination.objects.create(patient=patient, location=location, manufacture=request.data.get('patient_choice'), appointment=appointment)
                                            qr = pyqrcode.create(str(vac.vaccination_id))
                                            qr.png(f'qr_codes/{aid}.png', scale = 8)
                                            src = f'qr_codes/{aid}.png'
                                            subject, from_email, to = 'Appointment for COVID-19 Vaccine', 'donotreply@localhost', patient.email
                                            html_content = f'''
                                            <html>
                                                <body>
                                                    <p>Your appointment for your {vac.manufacture} vaccine was successfully made for {date} at {convertTime(time)}.</p>
                                                    <p>You can manage your appointment at <a href="{site}appointment/management/{aid}">{site}appointment/management/{aid}</a></p>
                                                </body>
                                            </html>
                                            '''
                                            text_content = ""
                                            msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                                            msg.attach_alternative(html_content, "text/html")
                                            msg.content_subtype = "html"
                                            msg.attach_file(src)
                                            msg.send()
                                            return Response(status=status.HTTP_201_CREATED)
                                        except:
                                            removeFile(src)
                                            appointment = Appointment.objects.get(id=aid).delete()
                                            return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                                return Response({'Message': 'You already have an pending vaccination appointment!'}, status=status.HTTP_400_BAD_REQUEST)
                            return Response({'Message': 'You are all vaxxed up!'}, status=status.HTTP_400_BAD_REQUEST)
                        return Response({'Message': 'You are all vaxxed up!'}, status=status.HTTP_400_BAD_REQUEST)
                return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except:
                seraializer = CreatePatientSerializer(data=request.data)
                if seraializer.is_valid():
                    kinSerializer = NextOfKinSerializer(data=request.data)
                    if kinSerializer.is_valid():
                        seraializer.save()
                        patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                        kinSerializer.save(patient=patient)
                        location = Location.objects.get(value=request.data.get('location'))
                        seraializer = CreateAppointmentSerializer(data=request.data)
                        if seraializer.is_valid():
                            if request.data.get('type') == "Testing":
                                try:
                                    seraializer.save(patient=patient, location=location)
                                    aid = seraializer.data['id']
                                    date = seraializer.data['date']
                                    time = seraializer.data['time']
                                    appointment = Appointment.objects.get(id=aid)
                                    test = Testing.objects.create(patient=patient, location=location, type=request.data.get('patient_choice'), appointment=appointment)
                                    qr = pyqrcode.create(str(test.testing_id))
                                    qr.png(f'qr_codes/{aid}.png', scale = 8)
                                    src = f'qr_codes/{aid}.png'
                                    subject, from_email, to = 'Appointment for COVID-19 Test', 'donotreply@localhost', patient.email
                                    html_content = f'''
                                    <html>
                                        <body>
                                            <p>Your appointment for your COVID-19 test was successfully made for {date} at {convertTime(time)}.</p>
                                            <p>You can manage your appointmnet at <a href="{site}appointment/management/{aid}">{site}appointment/management/{aid}</a></p>
                                            <img src="{src} />
                                        </body>
                                    </html>
                                    '''
                                    text_content = ""
                                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                                    msg.attach_alternative(html_content, "text/html")
                                    msg.content_subtype = "html"
                                    msg.attach_file(src)
                                    msg.send()
                                except:
                                    removeFile(src)
                                    patient.image.delete()
                                    patient.identification.delete()
                                    patient.delete()
                                    return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                                return Response(status=status.HTTP_201_CREATED)
                            else:
                                try:
                                    try:
                                        if len(Appointment.objects.filter(patient=patient, type='Vaccination')) == 0:
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
                                    date = seraializer.data['date']
                                    time = seraializer.data['time']
                                    appointment = Appointment.objects.get(id=aid)
                                    vac = Vaccination.objects.create(patient=patient, location=location,manufacture=request.data.get('patient_choice'), appointment=appointment)
                                    qr = pyqrcode.create(str(vac.vaccination_id))
                                    qr.png(f'qr_codes/{aid}.png', scale = 8)
                                    src = f'qr_codes/{aid}.png'
                                    subject, from_email, to = 'Appointment for COVID-19 Vaccine', 'donotreply@localhost', patient.email
                                    html_content = f'''
                                    <html>
                                        <body>
                                            <p>Your appointment for your {vac.manufacture} vaccine was successfully made for {date} at {convertTime(time)}</p>
                                            <p>You can manage your appointment at <a href="{site}ppointment/management/{aid}">{site}appointment/management/{aid}</a></p>
                                        </body>
                                    </html>
                                    '''
                                    text_content = ""
                                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                                    msg.attach_alternative(html_content, "text/html")
                                    msg.content_subtype = "html"
                                    msg.attach_file(src)
                                    msg.send()
                                except:
                                    removeFile(src)
                                    patient.image.delete()
                                    patient.delete()
                                    return Response({'Message': 'There was an error. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
                                return Response(status=status.HTTP_201_CREATED)
                        return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


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
                    src = f'qr_codes/{appointment.id}.png'
                    seraializer = AppointmentSerializer(appointment)
                    subject, from_email, to = 'Cancelled Appointment', 'donotreply@localhost', appointment.patient.email
                    html_content = f'''
                    <html>
                        <body>
                            <p>This is to notify that your appoinntment for {appointment.date} at {convertTime(appointment.time)} was successfully cancelled!</p>
                        </body>
                    </html>
                    '''
                    text_content = ""
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.content_subtype = "html"
                    msg.send()
                    try:
                        removeFile(src)
                    except:
                        pass
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
                        src = f'qr_codes/{appointment.id}.png'
                        seraializer = AppointmentSerializer(appointment)
                        subject, from_email, to = 'Appointment Updated', 'donotreply@localhost', appointment.patient.email
                        html_content = f'''
                        <html>
                            <body>
                                <p>This is to notify that your appointment was successfully updated.</p>
                                <p>Appointment Date: {appointment.date} <br />Appointment Time: {convertTime(appointment.time)} <br />Appointment Type: {appointment.type}</p>
                                <p>You can manage your appointment at <a href="{site}appointment/management/{appointment.id}">{site}appointment/management/{appointment.id}</a></p>
                            </body>
                        </html>
                        '''
                        text_content = ""
                        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                        msg.attach_alternative(html_content, "text/html")
                        msg.attach_file(src)
                        msg.content_subtype = "html"
                        msg.send()
                        return Response(seraializer.data,status=status.HTTP_202_ACCEPTED)
                    except:
                        return Response({'Message': "It's not you It's us!"}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'Message': 'Appointment date or time must be different to rescheduled.'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class LocationAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            if request.data.get('q') == 'Pending':
                appointments = Appointment.objects.filter(location=user.location, status='Pending')
                serializer = AppointmentSerializer(appointments, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            elif request.data.get('q') == 'Completed':
                appointments = Appointment.objects.filter(location=user.location, status='Completed')
                serializer = AppointmentSerializer(appointments, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            elif request.data.get('q') == 'All':
                appointments = Appointment.objects.filter(location=user.location)
                serializer = AppointmentSerializer(appointments, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            elif request.data.get('q') == 'Checked In':
                appointments = Appointment.objects.filter(location=user.location, status='Checked In')
                serializer = AppointmentSerializer(appointments, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                appointments = Appointment.objects.get(id=request.data.get('id'))
                serializer = AppointmentSerializer(appointments)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
    def patch(self, request):
        try:
            appointment = Appointment.objects.get(id=request.data.get('id'))
            if request.user.location == appointment.location and request.user.can_check_in:
                if appointment.status == 'Pending':
                    appointment.status = 'Checked In'
                    appointment.save()
                    return Response(status=status.HTTP_200_OK)
                return Response({'Message': 'This appointment can not be updated!'}, status=status.HTTP_403_FORBIDDEN)
            return Response({'Message': 'You are not authorized to check this patient in!'}, status=status.HTTP_401_UNAUTHORIZED)
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
                number_of_tests = len(Testing.objects.filter(location=location, status='Completed'))
                vaccines_administer = len(Vaccination.objects.filter(location=location, status='Completed'))
                pending_appointments = len(Appointment.objects.filter(location=location, status='pending'))
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
            return Response(location_list, status=status.HTTP_200_OK)
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
            locations = Location.objects.all()
            number_of_pfizer = Vaccine.objects.get(value='Pfizer').number_of_dose
            number_of_moderna = Vaccine.objects.get(value='Moderna').number_of_dose
            number_of_JJ = Vaccine.objects.get(value='Johnson & Johnson').number_of_dose
            positive_cases = len(PositiveCase.objects.exclude(status='Dead') and PositiveCase.objects.exclude(status='Recovered'))
            hospitalized = len(PositiveCase.objects.filter(status='Hospitalized'))
            recovered = len(PositiveCase.objects.filter(status='Recovered'))
            number_of_locations = len(locations)
            test_count = len(Testing.objects.filter(status='Completed'))
            vaccines_administer = len(Vaccination.objects.filter(status='Completed'))
            
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
                'pfizer_in_stock':number_of_pfizer,
                'moderna_in_stock':number_of_moderna,
                'JJ_in_stock':number_of_JJ,
                'positive_cases':positive_cases,
                'number_of_locations':number_of_locations,
                'vaccines_administer': vaccines_administer,
                'test_count':test_count,
                'hospitalized': hospitalized,
                'recovered': recovered
            }
            return Response(general_breakdown ,status=status.HTTP_200_OK)
        except:
            return Response({'Message': 'Something went wrong.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def location_breakdown(request):
    try:
        location = request.user.location
        number_of_tests = len(Testing.objects.filter(location=location, status='Completed'))
        vaccines_administer = len(Vaccination.objects.filter(location=location, status='Completed'))
        pending_appointments = len(Appointment.objects.filter(location=location, status='pending'))
        res = {
            'number_of_tests': number_of_tests,
            'vaccines_administer': vaccines_administer,
            'pending_appointments': pending_appointments,
        }
        return Response(res, status=status.HTTP_200_OK)
    except:
        return Response({'Message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)