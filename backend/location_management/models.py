from django.db import models
import uuid
from patient_management.models import Patient
import string    
import random

def codeGenerator():
    S = 8
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran

class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    authorization_code = models.CharField(max_length=8, default=codeGenerator)
    label = models.CharField(max_length=255, null=True, blank=True)
    value = models.CharField(max_length=255, null=True, blank=True)
    street_address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    parish = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.value

class Offer(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    label = models.CharField(max_length=255, null=True, blank=True)
    value = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.location.value


class Test(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    label = models.CharField(max_length=255, null=True, blank=True)
    value = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.value

def shorten_id_generator():
    S = 6
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran

class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    shorten_id = models.CharField(max_length=6, null=True, blank=True, default=shorten_id_generator, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    patient_choice = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(default="Pending" ,max_length=255, blank=True, null=True)

    def __str__(self):
        return str(self.id)
        