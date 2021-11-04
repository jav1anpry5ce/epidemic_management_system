from django.db import models
import uuid
from patient_management.models import Patient
from location_management.models import Location, Appointment


class Testing(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, blank=True, null=True)
    location = models.ForeignKey(Location, blank=True, null=True, on_delete=models.CASCADE)
    testing_id = models.UUIDField(default=uuid.uuid4, null=True, blank=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    result = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True, default='Pending')

    def __str__(self):
        return str(self.testing_id)
