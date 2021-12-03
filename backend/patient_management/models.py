from django.db import models
import uuid
import string    
import random


class Patient(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True, default='default.png')
    identification = models.FileField(upload_to='uploads/identification/')
    tax_number = models.CharField(max_length=12, null=True, unique=True)
    title = models.CharField(max_length=15, null=True)
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    email = models.EmailField(max_length=75, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True)
    date_of_birth = models.DateField(null=True)
    gender = models.CharField(max_length=50, null=True)
    street_address = models.CharField(max_length=500, null=True)
    city = models.CharField(max_length=100, null=True)
    parish = models.CharField(max_length=50, null=True)
    country = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.tax_number

    def image_url(self):
        if self.image:
            return 'http://192.168.0.200:8000' + self.image.url
        return ''

class NextOfKin(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    kin_first_name = models.CharField(max_length=50)
    kin_last_name = models.CharField(max_length=50)
    kin_email = models.EmailField(max_length=75, null=True, blank=True)
    kin_phone = models.CharField(max_length=20)

    def __str__(self):
        return self.patient.tax_number

class Representative(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    rep_first_name = models.CharField(max_length=50)
    rep_last_name = models.CharField(max_length=50)
    rep_email = models.EmailField(max_length=75, blank=True, null=True)
    rep_phone = models.CharField(max_length=50)


class PositiveCase(models.Model):
    case_id = models.UUIDField(unique=True, default=uuid.uuid4)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    date_tested = models.DateField(blank=True, null=True)
    recovering_location = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=50, default='Recovering')
    last_updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return '{} {}'.format(self.patient.tax_number, self.status)

def codeGenerator():
    S = 6
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran

class UpdatePatientCode(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    code = models.CharField(max_length=6, default=codeGenerator)
    created = models.DateTimeField(auto_now_add=True)

class PatientCode(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    code = models.CharField(max_length=6, default=codeGenerator)
    created = models.DateTimeField(auto_now_add=True)
