from django.db import models
from patient_management.models import Patient
import uuid
from location_management.models import Location, Appointment

class Vaccination(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, blank=True, null=True)
    vaccination_id = models.UUIDField(default=uuid.uuid4, null=True, blank=True)
    manufacture = models.CharField(max_length=255, blank=True, null=True)
    vile_number = models.IntegerField(unique=True, blank=True, null=True)
    date_given = models.DateField(blank=True, null=True)
    admister_person = models.CharField(max_length=255, blank=True, null=True)
    arm = models.CharField(max_length=255, blank=True, null=True)
    dose_number = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True, default='Pending')
    
    def __str__(self):
        return str(self.vaccination_id)