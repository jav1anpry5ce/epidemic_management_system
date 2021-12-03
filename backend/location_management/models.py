from django.db import models
import uuid
from patient_management.models import Patient
import string    
import random
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save

def codeGenerator():
    S = 8
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran

def shorten_id_generator():
    S = 6
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran
class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    authorization_code = models.CharField(max_length=8, default=codeGenerator, unique=True)
    label = models.CharField(max_length=50, null=True, blank=True)
    value = models.CharField(max_length=50, null=True, blank=True)
    street_address = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    parish = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.value

    class Meta:
        verbose_name = 'Site'

class Offer(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    label = models.CharField(max_length=50, null=True, blank=True)
    value = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.location.value

class Test(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    label = models.CharField(max_length=50, null=True, blank=True)
    value = models.CharField(max_length=50, null=True, blank=True)
    type = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.value


class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    shorten_id = models.CharField(max_length=10, null=True, default=None, blank=True, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    type = models.CharField(max_length=60, blank=True, null=True)
    patient_choice = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(default="Pending" ,max_length=50, blank=True, null=True)

    def __str__(self):
        return str(self.id)
        

@receiver(pre_save, sender=Appointment)
def create_short_id_pre_save(sender, instance, *args, **kwargs):
    from_id = str(instance.id).replace('-', '')
    shorten_id = ''.join(random.choices(from_id, k=10))
    if not instance.shorten_id:
        instance.shorten_id = shorten_id
