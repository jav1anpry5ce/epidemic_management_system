from django.db import models
import uuid
from patient_management.models import Patient

class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(default="Pending" ,max_length=255, blank=True, null=True)

    def __str__(self):
        return str(self.patient.unique_id)
