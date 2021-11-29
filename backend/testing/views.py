from django.core.mail import EmailMultiAlternatives
import pyqrcode
from functions import removeFile

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.sites.models import Site

from .models import Testing
from .serializers import TestingSerializer, UpdateTestingSerializer
from patient_management.models import Patient, PositiveCase

site = Site.objects.get_current()


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
                            test.status = 'Completed'
                            test.save()
                            test.appointment.status = 'Completed'
                            test.appointment.save()
                            serializer = TestingSerializer(test)
                            qr = pyqrcode.create(f'{site}patient-info/{test.patient.unique_id}')
                            qr.png(f'qr_codes/{test.patient.unique_id}.png', scale = 8)
                            src = f'qr_codes/{test.patient.unique_id}.png'
                            subject, from_email, to = '💅', 'donotreply@localhost', test.patient.email
                            if test.result == 'Positive':
                                PositiveCase.objects.create(patient=test.patient, recovering_location='Home', date_tested=test.date)
                                html_content = f'''
                                <html>
                                    <body>
                                        <p>Your COVID-19 {test.type} test result is here!</p>
                                        <p>Unfortunately you have tested postive for COVID-19. You will be contacted soon with instructions on how to proceed.</p>
                                        <p>You can view this record along with your vaccination record at <a href="{site}patient-info/{test.patient.unique_id}">{site}patient-info/{test.patient.unique_id}</a></p>
                                        <p>You may present the attached qr code to any business that requires proof of vaccination or latest test results.</p>
                                    </body>
                                </html>
                                '''
                            else:
                                html_content = f'''
                                <html>
                                    <body>
                                        <p>Your COVID-19 {test.type} test results is here!</p>
                                        <p>You can view this record along with your vaccination record at <a href="{site}patient-info/{test.patient.unique_id}">{site}patient-info/{test.patient.unique_id}</a></p>
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
                            try:
                                removeFile(src)
                                src = f'qr_codes/{test.appointment.id}.png'
                                removeFile(src)
                            except:
                                pass
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