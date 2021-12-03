from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.sites.models import Site

from .models import Vaccination
from .serializers import VaccinationSerializer, UpdateVaccinationSerializer
from patient_management.models import Patient

site = Site.objects.get_current()

class VaccinationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            record = Vaccination.objects.get(id=request.data.get('id'), status='Pending')
            if request.user.location == record.location: 
                try:
                    dose = Vaccination.objects.filter(patient=record.patient, status='Completed')
                    if not dose[0].manufacture == 'Johnson & Johnson':
                        if len(dose) == 0:
                            shot = 'First'
                        elif len(dose) == 1:
                            shot = 'Second'
                        elif len(dose) >= 2:
                            shot = 'Booster'
                    else:
                        shot = 'First'
                except:
                    shot = 'First'
                serializer = VaccinationSerializer(record)
                res = {'data': serializer.data, 'shot': shot}
                return Response(res, status=status.HTTP_200_OK)
            return Response({"Message": "You are not authorized to view this record"}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"Message": "This record does not exist."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        serializer = UpdateVaccinationSerializer(data=request.data)
        try:
            record = Vaccination.objects.get(id=request.data.get('id'))
            if request.user.location == record.location and request.user.can_update_vaccine:
                if serializer.is_valid():
                    if not request.data.get('arm') == "":
                        if not request.data.get('dose_number') == "":
                            if record.appointment.status == 'Checked In':
                                record.manufacture = request.data.get('manufacture')
                                record.vile_number = request.data.get('vile_number')
                                record.date_given = request.data.get('date_given')
                                record.admister_person = request.data.get('admister_person')
                                record.arm = request.data.get('arm')
                                record.dose_number = request.data.get('dose_number')
                                record.status = "Completed"
                                record.save()
                                return Response(status=status.HTTP_202_ACCEPTED)
                            return Response({'Message': 'This patient is not checked in!'}, status=status.HTTP_403_FORBIDDEN)
                        return Response({'Message': 'You must select a dose!'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'Message': 'An arm must be selected.'}, status=status.HTTP_400_BAD_REQUEST)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({"Message": "You are not authorized to update this record."}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            patient = Patient.objects.get(unique_id=request.data.get('id'))
            serializer = VaccinationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(patient=patient)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class VacView(APIView):
    def post(self, request):
        try:
            patient = Patient.objects.get(unique_id=request.data.get('id'))
            record = Vaccination.objects.filter(patient=patient, status='Completed')
            serializer = VaccinationSerializer(record, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)