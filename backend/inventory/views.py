from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django_filters import rest_framework as filterss
from django.contrib.sites.models import Site
from .models import LocationBatch, LocationVaccine, Vaccine
from .serializers import LocationBatchSerializer, VaccineSerializer
from location_management.models import Location
from location_management.serializers import LocationSerializer
from django.core.files import File
import pyqrcode
from functions import removeFile

site = Site.objects.get_current()

class IsMohStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_moh_admin:
            return True
        return False


class Batches(ListAPIView, IsMohStaff):
    queryset = LocationBatch.objects.all()
    serializer_class = LocationBatchSerializer
    permission_classes = [permissions.IsAuthenticated, IsMohStaff]
    pagination_class = PageNumberPagination
    ordering = ['date_created']

class BatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        if request.user.is_moh_staff:
            if request.data.get('location'):
                if request.data.get('vaccine'):
                    if request.data.get('number_of_dose'):
                        location = Location.objects.get(value=request.data.get('location'))
                        try:
                            vaccine = Vaccine.objects.get(value=request.data.get('vaccine'))
                            if not vaccine.number_of_dose < int(request.data.get('number_of_dose')):
                                vaccine.number_of_dose -= int(request.data.get('number_of_dose'))
                                vaccine.save()
                            else:
                                return Response({'Message': f'Not enough {vaccine.value} to distribute'}, status=status.HTTP_400_BAD_REQUEST)
                        except:
                            return Response(status=status.HTTP_400_BAD_REQUEST)
                        batch = LocationBatch.objects.create(location=location, number_of_dose=int(request.data.get('number_of_dose')), vaccine=vaccine)
                        qr = pyqrcode.create(f'{site}got-the-stach/{str(batch.batch_id)}')
                        qr.png(f'qr_codes/{batch.batch_id}.png', scale=8)
                        src = f'qr_codes/{batch.batch_id}.png'
                        batch.qr_image.save(f'{batch.batch_id}.png', File(open(src, 'rb')))
                        batch.save()
                        removeFile(src)
                        res = {
                            'location_name': location.value,
                            'street_address': location.street_address, 
                            'city': location.city, 
                            'parish': location.parish, 
                            'qr_image': 'http://192.168.0.200:8000' + batch.qr_image.url,
                            'date_created': batch.date_created,
                            }
                        return Response(res, status=status.HTTP_201_CREATED)
                    return Response({'Message': 'Number of dose is required.'}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'Message': 'Vaccine name is required.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'Location is required.'}, status=status.HTTP_400_BAD_REQUEST)

class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'pageSize'

class UserFiltering(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_authenticated:
                return queryset.all()

class LocationBatchList(ListAPIView):
    queryset = LocationBatch.objects.all()
    serializer_class = LocationBatchSerializer
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter]
    filter_fields = {
        'status': ['exact', 'contains', 'in']
    }
    pagination_class = CustomPageNumberPagination


@api_view(['PATCH'])
def receive_batch(request):
    try:
        batch = LocationBatch.objects.get(batch_id=request.data.get('batch_id'))
        location = batch.location
        if request.data.get('authorization_code') == location.authorization_code:
            if batch.status == 'Dispatched':
                batch.status = 'Received'
                batch.save()
                try:
                    vaccine = LocationVaccine.objects.get(value=str(batch.vaccine), location=batch.location)
                    vaccine.number_of_dose += batch.number_of_dose
                except:
                    vaccine = LocationVaccine.objects.create(location=batch.location, label=str(batch.vaccine), value=str(batch.vaccine), number_of_dose=batch.number_of_dose)
                vaccine.save()
                return Response(status=status.HTTP_200_OK)
            return Response({'Message': 'This batch can not be updated.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'You are not authorized to complete this request.'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'Message': 'Something went wrong.'} ,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_new_batch_info(request):
    try:
        vaccines = Vaccine.objects.filter(number_of_dose__gte=10)
        locations = Location.objects.all()
        vaccines_serializer = VaccineSerializer(vaccines, many=True)
        locations_serializer = LocationSerializer(locations, many=True)
        res = {'vaccines':vaccines_serializer.data, 'locations':locations_serializer.data}
        return Response(res, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

