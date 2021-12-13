from rest_framework import serializers

from .models import Patient, NextOfKin, PositiveCase, Representative, DeathCase, RecoveredCase, HospitalizedCase

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

    def create(self, validated_data):
        rep = Representative.objects.update_or_create(patient=validated_data.get('patient', None), defaults=validated_data)
        return rep

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
            'id',
            'patient',
            'date_tested',
            'recovering_location',
            'status',
        )

class DeathCaseSerializer(serializers.ModelSerializer):
    patient = GetDetailedPatient()
    class Meta:
        model = DeathCase
        fields = (
            'id',
            'patient',
            'death_date',
        )

class RecoveredCaseSerializer(serializers.ModelSerializer):
    patient = GetDetailedPatient()
    class Meta:
        model = RecoveredCase
        fields = (
            'id',
            'patient',
            'recovery_date',
        )

class HospitalizedCaseSerializer(serializers.ModelSerializer):
    patient = GetDetailedPatient()
    class Meta:
        model = HospitalizedCase
        fields = (
            'id',
            'patient',
            'hospitalized_date',
        )