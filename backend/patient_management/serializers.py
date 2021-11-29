from rest_framework import serializers

from .models import Patient, NextOfKin, PositiveCase, Representative

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = (
            'tax_number',
            'image_url',
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'city',
            'country',
        )

class GetDetailedPatient(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = (
            'tax_number',
            'first_name',
            'last_name',
            'title',
            'email',
            'phone',
            'date_of_birth',
            'gender',
            'street_address',
            'city',
            'parish',
            'country',
            'image_url',
        )

class CreatePatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = (
            'tax_number',
            'title',
            'image',
            'identification',
            'first_name',
            'last_name',
            'email',
            'phone',
            'date_of_birth',
            'gender',
            'street_address',
            'city',
            'parish',
            'country',
        )

class NextOfKinSerializer(serializers.ModelSerializer):
    class Meta:
        model = NextOfKin
        fields = (
            'kin_first_name',
            'kin_last_name',
            'kin_email',
            'kin_phone',
        )

class RepresentativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Representative
        fields = (
            'rep_first_name',
            'rep_last_name',
            'rep_email',
            'rep_phone',
        )

class UpdatePatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = (
            'phone',
            'street_address',
            'city',
            'parish',
            'country',
            'image',
        )

class PositiveCaseSerializer(serializers.ModelSerializer):
    patient = GetDetailedPatient()
    class Meta:
        model = PositiveCase
        fields = (
            'case_id',
            'patient',
            'date_tested',
            'recovering_location',
            'status',
        )