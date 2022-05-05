import calendar
import datetime
import csv
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.decorators import parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django_filters import rest_framework as filterss
from sms import send_sms
from django.core.mail import EmailMultiAlternatives

from .models import Patient, UpdatePatientCode, PatientCode, NextOfKin, PositiveCase, Representative, DeathCase, RecoveredCase, HospitalizedCase
from .serializers import (
    PatientSerializer, 
    CreatePatientSerializer, 
    GetDetailedPatient, 
    UpdatePatientSerializer,
    NextOfKinSerializer, 
    PositiveCaseSerializer, 
    RepresentativeSerializer, 
    DeathCaseSerializer,
    RecoveredCaseSerializer,
    )
from testing.models import Testing
from vaccination.models import Vaccination
from testing.serializers import TestingSerializer
from vaccination.serializers import VaccinationSerializer
import pyqrcode
from functions import removeFile

site = settings.DJANGO_SITE

class PatientView(APIView):
    def post(self, request):
        try:
            patient = Patient.objects.get(unique_id=request.data.get('id'))
            seraializer = PatientSerializer(patient)
            return Response(seraializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    def patch(self, request):
        try:
            patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
            seraializer = GetDetailedPatient(patient)
            return Response(seraializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_patient_object(request, unique_id):
    try:
        patient = Patient.objects.get(unique_id=unique_id)
        seraializer = PatientSerializer(patient)
        return Response(seraializer.data, status=status.HTTP_200_OK) 
    except:
        return Response(status=status.HTTP_404_NOT_FOUND) 

@api_view(['GET'])
def get_detailed_patient_object(request, trn):
    try:
        patient = Patient.objects.get(tax_number=trn)
        seraializer = GetDetailedPatient(patient)
        return Response(seraializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify(request):
    try:
        if Patient.objects.get(tax_number=request.data.get('tax_number')):
            return Response({'Message': 'Verify'}, status=status.HTTP_202_ACCEPTED)
    except:
        return Response({'Message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def accept(request):
    try:
        patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
        next_of_kin = NextOfKin.objects.get(patient=patient)
        if request.data.get('last_name').upper() == patient.last_name.upper() and request.data.get('date_of_birth') == str(patient.date_of_birth):
            seraializer = GetDetailedPatient(patient)
            kin_serializer = NextOfKinSerializer(next_of_kin)
            res = {
                "patient": seraializer.data,
                "kin": kin_serializer.data,
            }
            return Response(res, status=status.HTTP_200_OK)
        return Response({'Message': 'Verification failed!'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_info_verify(request):
    try:
        try:
            if request.data.get('date_of_birth'):
                if Patient.objects.filter(tax_number=request.data.get('tax_number')).exists():
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                else:
                    return Response({'Message': 'The enterd information does not match our records!'}, status=status.HTTP_404_NOT_FOUND)
                if patient.last_name.upper() == request.data.get('last_name').upper() and str(patient.date_of_birth) == str(request.data.get('date_of_birth')):
                    if UpdatePatientCode.objects.filter(patient=patient).exists():
                        UpdatePatientCode.objects.get(patient=patient).delete()
                    UpdatePatientCode.objects.create(patient=patient)
                    return Response(status=status.HTTP_204_NO_CONTENT)
                return Response({'Message': 'The enterd information does not match our records!'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'Message': 'Please enter a date of birth'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'Message': "It's not you It's us"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_code(request):
    try:
        patient = UpdatePatientCode.objects.get(code=request.data.get('code')).patient
        code = PatientCode.objects.create(patient=patient)
        return Response({'Code': code.code}, status=status.HTTP_202_ACCEPTED)
    except:
        return Response({'Message': 'Invalid code entered!'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def update_info(request):
    try:
        code = PatientCode.objects.get(code=request.data.get('code'))
        patient = code.patient
        seraializer = UpdatePatientSerializer(data=request.data)
        if seraializer.is_valid():
            if seraializer.data['phone']:
                patient.phone = seraializer.data['phone']
            if seraializer.data['street_address'] and seraializer.data['city'] and seraializer.data['parish']:
                patient.street_address = seraializer.data['street_address']
                patient.city = seraializer.data['city']
                patient.parish = seraializer.data['parish']
            if seraializer.data['country']:
                patient.country = seraializer.data['country']
            if request.FILES.get('image'):
                patient.image = request.FILES.get('image')
            patient.save()
            UpdatePatientCode.objects.get(patient=patient).delete()
            code.delete()
            return Response({'Message': 'Updated!'}, status=status.HTTP_200_OK)
        return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)



class CreatePatientView(APIView):
    def post(self, request):
        try:
            seraializer = CreatePatientSerializer(data=request.data)
            if seraializer.is_valid():
                seraializer.save()
                return Response(seraializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'pageSize'

class UserFiltering(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_authenticated:
                return queryset.all()

class MOHPatientView(ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = GetDetailedPatient
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filter_fields = {
            'last_name': ['exact', 'contains', 'in'],
            'tax_number': ['exact', 'contains', 'in']
        }
    ordering = ['tax_number']
    search_fields = ['last_name', 'tax_number']
    pagination_class = CustomPageNumberPagination

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_patient_details(request, trn):
    try:
        if request.user.is_moh_staff:
            patient = Patient.objects.get(tax_number=trn)
            tests = Testing.objects.filter(patient=patient, status='Completed')
            vaccines = Vaccination.objects.filter(patient=patient, status='Completed')
            tests_serializer = TestingSerializer(tests, many=True)
            vaccine_serializer = VaccinationSerializer(vaccines, many=True)
            patient_seraializer = GetDetailedPatient(patient)
            res = {'patient': patient_seraializer.data, 'tests': tests_serializer.data, 'vaccines': vaccine_serializer.data}
            return Response(res, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class GetCases(ListAPIView):
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    pagination_class = CustomPageNumberPagination
    ordering = ['patient__tax_number']
    search_fields = ['patient__last_name', 'patient__tax_number']

    def get_queryset(self):
        ex_list = ['Dead', 'Recovered']
        if self.kwargs.get('status') == 'Death':
            return DeathCase.objects.filter(patient__parish=self.request.GET.get('parish'))
        elif self.kwargs.get('status') == 'Recovered':
            return RecoveredCase.objects.filter(patient__parish=self.request.GET.get('parish'))
        else:
            return PositiveCase.objects.filter(patient__parish=self.request.GET.get('parish')).exclude(status__in=ex_list)

    def get_serializer_class(self):
        if self.kwargs.get('status') == 'Death':
            serializer_class = DeathCaseSerializer
            return serializer_class
        elif self.kwargs.get('status') == 'Recovered':
            serializer_class = RecoveredCaseSerializer
            return serializer_class
        else:
            serializer_class = PositiveCaseSerializer
            return serializer_class



@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_case(request, type, id):
    try:
        if request.user.is_moh_staff:
            if type == 'Death':
                case = DeathCase.objects.get(id=id)
                serializer = DeathCaseSerializer(case)
            elif type == 'Recovered':
                case = RecoveredCase.objects.get(id=id)
                serializer = RecoveredCaseSerializer(case)
            else: 
                case = PositiveCase.objects.get(id=id)
                serializer = PositiveCaseSerializer(case)

            next_of_kin = NextOfKin.objects.get(patient=case.patient)
            next_of_kin_serializer = NextOfKinSerializer(next_of_kin)
            try: 
                rep = Representative.objects.get(patient=case.patient)
                rep_serializer = RepresentativeSerializer(rep)
                rep_data = rep_serializer.data
            except:
                rep_data = None
            res = {
                "case": serializer.data,
                "next_of_kin": next_of_kin_serializer.data,
                "rep": rep_data
            }
            return Response(res, status=status.HTTP_200_OK)
        return Response({'Message': 'You are not authorized to view positive cases!'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_case(request, id):
    try:
        if request.user.is_moh_staff:
            case = PositiveCase.objects.get(id=id)
            if request.data.get('recovering_location') != case.recovering_location or request.data.get('status') != case.status:
                if request.data.get('recovering_location'):
                    case.recovering_location = request.data.get('recovering_location')
                if request.data.get('status'):
                    case.status = request.data.get('status')
                case.save()
                return Response({'Message': 'Case updated!'}, status=status.HTTP_204_NO_CONTENT)
            return Response({'Message': 'Recovering loacation or status must be different in order to update.'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'Message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

def date_iter(year, month):
    for i in range(1, calendar.monthrange(year, month)[1] + 1):
        yield datetime.date(year, month, i)

@api_view(['GET'])
def graph(request, year, month, parish):
    drl_dict = []
    p_dict = []
    v_dict = []
    for date in date_iter(year, month):
        if parish == 'All':
            death = DeathCase.objects.filter(death_date=date).count()
            recovered = RecoveredCase.objects.filter(recovery_date=date).count()
            hospitalized = HospitalizedCase.objects.filter(hospitalized_date=date).count()
            male = PositiveCase.objects.filter(date_tested=date, patient__gender='Male').count()
            female = PositiveCase.objects.filter(date_tested=date, patient__gender='Female').count()
            vaccinations = Vaccination.objects.filter(date_given=date, status='Completed').count()
        else:
            death = DeathCase.objects.filter(death_date=date, patient__parish=parish).count()
            recovered = RecoveredCase.objects.filter(recovery_date=date, patient__parish=parish).count()
            hospitalized = HospitalizedCase.objects.filter(hospitalized_date=date, patient__parish=parish).count()
            male = PositiveCase.objects.filter(date_tested=date, patient__gender='Male', patient__parish=parish).count()
            female = PositiveCase.objects.filter(date_tested=date, patient__gender='Female', patient__parish=parish).count()
            vaccinations = Vaccination.objects.filter(date_given=date, status='Completed', patient__parish=parish).count()
        data = {
            'name': date.strftime('%d-%h'),
            'death': death,
            'recovered': recovered,
            'hospitalized':hospitalized,
        }
        drl_dict.append(data)
        positive_data = {
            'name': date.strftime('%d-%h'),
            'male': male,
            'female': female,
        }
        p_dict.append(positive_data)
        v_data = {
            'name': date.strftime('%d-%h'), 
            'vaccinations': vaccinations,
            }
        v_dict.append(v_data)
    res = {
        'drl': drl_dict,
        'mvf': p_dict,
        'vaccinations': v_dict,
    }
    return Response(res, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def generate_cvs(request, date, type):
    try:
        if request.user.is_moh_staff:
            with open (f'media/csv/{type}-report-{date}-for-{str(request.user)}.csv', 'w', newline='') as f:
                writer = csv.writer(f)
                if type == 'Positive Cases':
                    writer.writerow(['First Name', 'Last Name', 'Gender', 'Date Of Birth', 'Phone', 'City', 'Parish', 'Date',])
                    cases = PositiveCase.objects.filter(date_tested=date).values_list('patient__first_name', 'patient__last_name', 'patient__gender', 'patient__date_of_birth', 'patient__phone', 'patient__city', 'patient__parish', 'date_tested')
                if type == 'Death':
                    writer.writerow(['First Name', 'Last Name', 'Gender', 'Date Of Birth', 'City', 'Parish', 'Date',])
                    cases = DeathCase.objects.filter(death_date=date).values_list('patient__first_name', 'patient__last_name', 'patient__gender', 'patient__date_of_birth', 'patient__city', 'patient__parish', 'death_date')
                if type == 'Recovered':
                    writer.writerow(['First Name', 'Last Name', 'Gender', 'Date Of Birth', 'City', 'Parish', 'Date',])
                    cases = RecoveredCase.objects.filter(recovery_date=date).values_list('patient__first_name', 'patient__last_name', 'patient__gender', 'patient__date_of_birth', 'patient__city', 'patient__parish', 'recovery_date')
                if type == 'Hospitalized':
                    writer.writerow(['First Name', 'Last Name', 'Gender', 'Date Of Birth', 'City', 'Parish', 'Date',])
                    cases = HospitalizedCase.objects.filter(hospitalized_date=date).values_list('patient__first_name', 'patient__last_name', 'patient__gender', 'patient__date_of_birth', 'patient__city', 'patient__parish', 'hospitalized_date')
                for case in cases:
                    writer.writerow(case)
            return Response({'link': f'{settings.BACKEND_FILES}media/csv/{type}-report-{date}-for-{str(request.user)}.csv'})
        return Response({'Message': 'You are not authorized to generate this report!'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_patient_records(request):
    if Patient.objects.filter(tax_number=request.data.get('trn')).exists():
        patient = Patient.objects.get(tax_number=request.data.get('trn'))
        code = PatientCode.objects.get_or_create(patient=patient)
        subject, from_email, to = 'Verify identity', 'jav1anpry5ce@javaughnpryce.live', patient.email
        html_content = f'''
        <html>
            <body>
                <p>Hello {patient.first_name},</p>
                <p>We have received your request to view your records.</p>
                <p>Please enter the code provied below to verify your identity, and you will be on your way.</p>
                <p>Code: {code[0].code}</p>
                <p>Do not share this code with anyone!</p>
            </body>
        </html>
        '''
        text_content = ""
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = "html"
        msg.send()
        text = f'''Hello {patient.first_name},
We have received your request to view your records.
Please enter the code provied below to verify your identity, and you will be on your way.
Code: {code[0].code}
Do not share this code with anyone!
'''
        send_sms(
        text.strip(),
        '+12065550100',
        [f'{patient.phone},'],
        fail_silently=True
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response({'Message': 'Patient not found'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def get_patient_records_link(request):
    if PatientCode.objects.filter(code=request.data.get('code')).exists():
        patient = PatientCode.objects.get(code=request.data.get('code')).patient
        qr = pyqrcode.create(f'{site}patient-info/{patient.unique_id}')
        qr.png(f'qr_codes/{patient.unique_id}.png', scale = 8)
        src = f'qr_codes/{patient.unique_id}.png'
        subject, from_email, to = 'Record Link', 'jav1anpry5ce@javaughnpryce.live', patient.email
        html_content = f'''
        <html>
            <body>
                <p>Hello {patient.first_name},</p>
                <p>Here is the link to view your records <a href="{site}patient-info/{patient.unique_id}">{site}patient-info/{patient.unique_id}</a></p>
                <p>You may present the attached qr code to any business that requires proof of vaccination or latest test results.</p>
            </body>
        </html>
        '''
        text_content = ""
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = "html"
        msg.attach_file(src)
        msg.send()
        removeFile(src)
        text = f'''Hello {patient.first_name},
    Here is the link to view your records. {site}patient-info/{patient.unique_id}
    '''
        send_sms(
        text.strip(),
        '+12065550100',
        [f'{patient.phone},'],
        fail_silently=True
        )
        PatientCode.objects.get(patient=patient).delete()
        return Response({'Link': f'patient-info/{patient.unique_id}'}, status=status.HTTP_200_OK)
    return Response({'Message': 'Could not verify you!'}, status=status.HTTP_400_BAD_REQUEST)
        
