from rest_framework import serializers
from .models import Appointment
from patient.seraializers import PatientSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Appointment
        fields = (
            'patient',
            'id',
            'location',
            'date',
            'time',
            'type',
            'status',
        )

class CreateAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = (
            'id',
            'location',
            'date',
            'time',
            'type',
            'status',
        )