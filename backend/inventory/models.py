from django.db import models
from location_management.models import Location
import uuid


class Vaccine(models.Model):
    label = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    number_of_dose = models.IntegerField()

    def __str__(self):
        return '{}'.format(self.value)


class LocationBatch(models.Model):
    batch_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE, blank=True, null=True)
    number_of_dose = models.IntegerField()
    status = models.CharField(max_length=50, default='Dispatched')
    qr_image = models.ImageField(upload_to='batch_qr/', blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-date_created',)
        verbose_name = 'Site Batch'
        verbose_name_plural = 'Site Batches'

    def __str__(self):
        return str(self.batch_id)



class LocationVaccine(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    label = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    number_of_dose = models.IntegerField()

    class Meta:
        verbose_name = 'Site Vaccine'
        

    def __str__(self):
        return '{}'.format(self.value)
