from rest_framework import serializers

from .models import Testing

class TestingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testing
        fields = (
            'patient',
            'testing_id',
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
