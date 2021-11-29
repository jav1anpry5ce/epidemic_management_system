from django.db.models.base import Model
from rest_framework import serializers

from .models import Vaccination
from patient_management.serializers import PatientSerializer

class VaccinationSerializer(serializers.ModelSerializer):
    # patient = PatientSerializer()
    class Meta:
        model = Vaccination
        fields = (
            'patient',
            'location',
            'id',
            'manufacture',
            'vile_number',
            'date_given',
            'admister_person',
            'arm',
            'dose_number',
            'status',
        )

class UpdateVaccinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccination
        fields = (
            'manufacture', 
            'vile_number',
            'date_given',
            'admister_person',
            'arm',
            'dose_number',
        )

class GetVaccinationSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Vaccination
        fields = (
            'id',
            'patient',
        )