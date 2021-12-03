import calendar
import datetime
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.decorators import parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from django.core.mail import EmailMultiAlternatives
from rest_framework.pagination import PageNumberPagination
import django_filters
from rest_framework import filters
from django_filters import rest_framework as filterss

from .models import Patient, UpdatePatientCode, PatientCode, NextOfKin, PositiveCase, Representative
from .serializers import PatientSerializer, CreatePatientSerializer, GetDetailedPatient, UpdatePatientSerializer, NextOfKinSerializer, PositiveCaseSerializer, RepresentativeSerializer
from testing.models import Testing
from vaccination.models import Vaccination
from testing.serializers import TestingSerializer
from vaccination.serializers import VaccinationSerializer

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
                try:
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                except:
                    return Response({'Message': 'TRN entered does not match any in our system.'}, status=status.HTTP_404_NOT_FOUND)
                if patient.last_name.upper() == request.data.get('last_name').upper() and str(patient.date_of_birth) == str(request.data.get('date_of_birth')):
                    try:
                        UpdatePatientCode.objects.get(patient=patient).delete()
                    except:
                        pass
                    code = UpdatePatientCode.objects.create(patient=patient)
                    subject, from_email, to = 'Information update request', 'donotreply@localhost', patient.email
                    html_content = f'''
                    <html>
                        <body>
                            <p>Hello {patient.first_name},</p>
                            <p>We have received your request to update your personal information.</p>\
                            <p>Please enter the code provied below to verify your identity, and you will be on your way of updating your info.</p>
                            <p>Code: {code.code}</p>
                            <p>Do not share this code with anyone!</p>
                        </body>
                    </html>
                    '''
                    text_content = ""
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.content_subtype = "html"
                    msg.send()
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

@api_view(['PATCH'])
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
def get_patient(request, trn):
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


class GetPositiveCases(ListAPIView):
    queryset = PositiveCase.objects.all()
    serializer_class = PositiveCaseSerializer
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    pagination_class = CustomPageNumberPagination
    ordering = ['patient__tax_number']
    search_fields = ['patient__last_name', 'patient__tax_number']



@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_case(request, case_id):
    try:
        if request.user.is_moh_staff:
            case = PositiveCase.objects.get(case_id=case_id)
            next_of_kin = NextOfKin.objects.get(patient=case.patient)
            next_of_kin_serializer = NextOfKinSerializer(next_of_kin)
            serializer = PositiveCaseSerializer(case)
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
def update_case(request, case_id):
    try:
        if request.user.is_moh_staff:
            case = PositiveCase.objects.get(case_id=case_id)
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
def graph(request, year, month):
    drl_dict = []
    p_dict = []
    v_dict = []
    exclude_list = ['Dead', 'Recovered']
    for date in date_iter(year, month):
        death = PositiveCase.objects.filter(status='Dead', last_updated=date).count()
        recovered = PositiveCase.objects.filter(status='Recovered', last_updated=date).count()
        hospitalized = PositiveCase.objects.filter(status='Hospitalized', last_updated=date).count()
        data = {
            'name': date.strftime('%d-%h'),
            'death': death,
            'recovered': recovered,
            'hospitalized':hospitalized,
        }
        drl_dict.append(data)
        male = PositiveCase.objects.filter(date_tested=date, patient__gender='Male').exclude(status__in=exclude_list).count()
        female = PositiveCase.objects.filter(date_tested=date, patient__gender='Female').exclude(status__in=exclude_list).count()
        positive_data = {
            'name': date.strftime('%d-%h'),
            'male': male,
            'female': female,
        }
        p_dict.append(positive_data)
        vaccinations = Vaccination.objects.filter(date_given=date, status='Completed').count()
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