from django.conf import settings
from django.db import models
import uuid
import string    
import random
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from sms import send_sms
from django.utils import timezone

class Patient(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True, default='default.png')
    identification = models.FileField(upload_to='uploads/identification/', null=True, blank=True)
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
        return str(self.tax_number)

    def image_url(self):
        if self.image:
            return settings.BACKEND_FILES + self.image.url
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
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    date_tested = models.DateField(blank=True, null=True)
    recovering_location = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=50, default='Recovering')
    last_updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return '{} {}'.format(self.patient.tax_number, self.status)

class DeathCase(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    death_date = models.DateField()
    last_updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return '{}'.format(self.patient.tax_number)

class RecoveredCase(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    recovery_date = models.DateField()
    last_updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return '{}'.format(self.patient.tax_number)

class HospitalizedCase(models.Model):
    patient =models.ForeignKey(Patient, on_delete=models.CASCADE)
    hospitalized_date = models.DateField()
    last_updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return '{}'.format(self.patient.tax_number)

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


@receiver(post_save, sender=UpdatePatientCode)
def patient_code_post_save(sender, instance, created, *args, **kwargs):
    if created:
        subject, from_email, to = 'Information update request', 'jav1anpry5ce@javaughnpryce.live', instance.patient.email
        html_content = f'''
        <html>
            <body>
                <p>Hello {instance.patient.first_name},</p>
                <p>We have received your request to update your personal information.</p>
                <p>Please enter the code provied below to verify your identity, and you will be on your way of updating your info.</p>
                <p>Code: {instance.code}</p>
                <p>Do not share this code with anyone!</p>
            </body>
        </html>
        '''
        text_content = ""
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = "html"
        msg.send()
        text = f'''Hello {instance.patient.first_name},
We have received your request to update your personal information.
Please enter the code provied below to verify your identity, and you will be on your way of updating your info.
Code: {instance.code}
Do not share this code with anyone!
'''
        send_sms(
        text.strip(),
        '+12065550100',
        [f'{instance.patient.phone},'],
        fail_silently=True
        )
    
@receiver(post_save, sender=PositiveCase)
def create_case_pre_save(sender, instance, *args, **kwargs):
    if instance.status == 'Dead':
        print('Hey')
        if not DeathCase.objects.filter(patient=instance.patient).exists():
            DeathCase.objects.create(patient=instance.patient, death_date=timezone.now())

    if instance.status == 'Recovered':
        if not RecoveredCase.objects.filter(patient=instance.patient, recovery_date=timezone.now()).exists():
            RecoveredCase.objects.create(patient=instance.patient, recovery_date=timezone.now())

    if instance.status == 'Hospitalized':
        if not HospitalizedCase.objects.filter(patient=instance.patient, hospitalized_date=timezone.now()).exists():
            HospitalizedCase.objects.create(patient=instance.patient, hospitalized_date=timezone.now())

