from django.conf import settings
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Testing
from .serializers import TestingSerializer, UpdateTestingSerializer
from patient_management.models import Patient

site = settings.DJANGO_SITE



class TestingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            test = Testing.objects.get(id=request.data.get('id'), status='Pending')
            if request.user.location == test.location:
                serializer = TestingSerializer(test)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'Message': 'You are not authorized to view this record!'}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"Message": "This record does not exist."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            patient = Patient.objects.get(unique_id=request.data.get('id'))
            serializer = TestingSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(patient=patient)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        try:
            serializer = UpdateTestingSerializer(data=request.data)
            test = Testing.objects.get(id=request.data.get('id'))
            if request.user.location == test.location and request.user.can_update_test:
                if serializer.is_valid():
                    if not request.data.get('result') == "":
                        if test.appointment.status == 'Checked In':
                            test.result = request.data.get('result')
                            test.type = request.data.get('type')
                            test.date = request.data.get('date')
                            test.save(update_fields=['result', 'type', 'date', 'status'])
                            serializer = TestingSerializer(test)
                            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
                        return Response({'Message': 'This patient is not checked in.'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'Message': 'Please select a result!'}, status=status.HTTP_400_BAD_REQUEST)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'You are not authorized to to update testing data!'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class TestView(APIView):
    def post(self, request):
        try:
            patient = Patient.objects.get(unique_id=request.data.get('id'))
            test = Testing.objects.filter(patient=patient, status='Completed')
            serializer = TestingSerializer(test, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)