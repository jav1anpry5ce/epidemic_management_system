from django.conf import settings
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
from .models import LocationBatch, LocationVaccine, Vaccine
from .serializers import LocationBatchSerializer, VaccineSerializer
from location_management.models import Location, Offer
from location_management.serializers import LocationSerializer
from django.core.files import File
import pyqrcode
from functions import removeFile

site = settings.DJANGO_SITE

class IsMohStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_moh_admin:
            return True
        return False


class Batches(ListAPIView, IsMohStaff):
    queryset = LocationBatch.objects.all()
    serializer_class = LocationBatchSerializer
    permission_classes = [permissions.IsAuthenticated, IsMohStaff]
    filter_backends = [filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    pagination_class = PageNumberPagination
    ordering = ['date_created']
    search_fields = ['location__value', 'batch_id']


class BatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        if request.user.is_moh_staff:
            if request.data.get('location'):
                if request.data.get('vaccine'):
                    if request.data.get('number_of_dose'):
                        location = Location.objects.get(slug=request.data.get('location'))
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
                            'vaccine': vaccine.label,
                            'location_name': location.value,
                            'street_address': location.street_address, 
                            'city': location.city, 
                            'parish': location.parish, 
                            'qr_image': 'https://backend.javaughnpryce.live:8001' + batch.qr_image.url,
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
    filter_backends = [UserFiltering, filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filter_fields = {
        'status': ['exact', 'contains', 'in']
    }
    ordering = ['status', '-date_created']
    order_by = ('date_created')
    search_fields = ['location__value', 'batch_id']
    pagination_class = CustomPageNumberPagination


@api_view(['PATCH'])
def receive_batch(request):
    try:
        batch = LocationBatch.objects.get(batch_id=request.data.get('batch_id'))
        location = batch.location
        if request.data.get('authorization_code').upper().strip() == location.authorization_code:
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
        if request.user.is_moh_staff:
            vaccines = Vaccine.objects.filter(number_of_dose__gte=10)
            location_dict = []
            locations = Offer.objects.filter(value='Vaccination')
            for location in locations:
                location_serializer = LocationSerializer(location.location, many=False)
                location_dict.append(location_serializer.data)
            vaccines_serializer = VaccineSerializer(vaccines, many=True)
            res = {'vaccines':vaccines_serializer.data, 'locations':location_dict}
            return Response(res, status=status.HTTP_200_OK)
        return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_locations(request):
    try:
        if request.user.is_moh_staff:
            locations = Location.objects.all()
            serializer = LocationSerializer(locations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_batch(request, batch_id):
    try:
        if request.user.is_moh_staff:
            batch = LocationBatch.objects.get(batch_id=batch_id)
            data = {
                'vaccine': batch.vaccine.label,
                'location_name': batch.location.value,
                'street_address': batch.location.street_address,
                'city': batch.location.city,
                'parish': batch.location.parish,
                'date_created': batch.date_created,
                'qr_image': f'{settings.BACKEND_FILES}{batch.qr_image.url}'
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'Message': 'Something went wrong!'}, status =status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_vaccine(request):
    if request.user.is_moh_staff:
        try:
            vaccines = Vaccine.objects.all()
            serializer = VaccineSerializer(vaccines, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_inventory(request):
    if request.user.is_moh_staff:
        try:
            vaccine = Vaccine.objects.get(value=request.data.get('vaccine'))
            vaccine.number_of_dose += int(request.data.get('number_of_dose'))
            vaccine.save()
            return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
        except:
            return Response({'Message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)