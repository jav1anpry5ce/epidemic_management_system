from rest_framework import serializers

from .models import Testing
from patient_management.serializers import PatientSerializer

class TestingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testing
        fields = (
            'patient',
            'id',
            'type',
            'date',
            'result',
            'status',
        )

class UpdateTestingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testing
        fields = (
            'type',
            'date',
            'result',
        )

class getTestSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Testing
        fields = (
            'id',
            'patient',
        )
