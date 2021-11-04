from rest_framework import serializers
from patient_management.serializers import PatientSerializer
from .models import Location, Offer, Test, Appointment

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
        'id',
        'label', 
        'value', 
        'role'
        )

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = (
            'label',
            'value',
            'role',
        )


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = (
            'label',
            'value',
            'role',
        )

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    location = LocationSerializer()
    class Meta:
        model = Appointment
        fields = (
            'patient',
            'id',
            'location',
            'date',
            'time',
            'type',
            'patient_choice',
            'status',
        )

class CreateAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = (
            'id',
            'date',
            'time',
            'type',
            'patient_choice',
            'status',
        )