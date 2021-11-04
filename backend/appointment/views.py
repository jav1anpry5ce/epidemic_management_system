from rest_framework import status, authentication, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Appointment
from patient.models import Patient
from .serializers import AppointmentSerializer, CreateAppointmentSerializer
from patient.seraializers import CreatePatientSerializer
from testing.models import Testing
from vaccination.models import Vaccination

class AppointmentView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        try:
            try:
                # print(request.data)
                seraializer = CreateAppointmentSerializer(data=request.data)
                if seraializer.is_valid():
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                    seraializer.save(patient=patient)
                    if request.data.get('type') == "Testing":
                        test = Testing.objects.create(patient=patient)
                        print(test.testing_id)
                    else:
                        vac = Vaccination.objects.create(patient=patient)
                        print(vac.vaccination_id)
                    return Response(seraializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except:
                # print(request.data)
                seraializer = CreatePatientSerializer(data=request.data)
                if seraializer.is_valid():
                    seraializer.save()
                    patient = Patient.objects.get(tax_number=request.data.get('tax_number'))
                    seraializer = CreateAppointmentSerializer(data=request.data)
                    if seraializer.is_valid():
                        seraializer.save(patient=patient)
                        if request.data.get('type') == "Testing":
                            test = Testing.objects.create(patient=patient)
                            print(test.testing_id)
                        else:
                            vac = Vaccination.objects.create(patient=patient)
                            print(vac.vaccination_id)
                        return Response(seraializer.data, status=status.HTTP_201_CREATED)
                    else:
                        return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(seraializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AppointmentManagementView(APIView):
    def post(self, request):
        try:
            try:
                patient = Patient.objects.get(tax_number=request.data.get('q'))
                appointment = Appointment.objects.filter(patient=patient)
                seraializer = AppointmentSerializer(appointment, many=True)
                return Response(seraializer.data, status=status.HTTP_200_OK)
            except:
                appointment = Appointment.objects.get(id=request.data.get('q'))
                seraializer = AppointmentSerializer(appointment)
                return Response(seraializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)




