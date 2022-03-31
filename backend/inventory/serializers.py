from rest_framework import serializers
from .models import LocationVaccine, LocationBatch, Vaccine
from location_management.serializers import LocationSerializer 

class VaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccine
        fields = (
            'value',
            'number_of_dose',
        )


class LocationVaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationVaccine
        fields = (
            'value',
            'label', 
            'number_of_dose',
        )

class LocationBatchSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    vaccine = VaccineSerializer()
    class Meta:
        model = LocationBatch
        fields = (
            'batch_id',
            'location',
            'vaccine',
            'number_of_dose',
            'status',
            'date_created',
            'last_updated',
        )

