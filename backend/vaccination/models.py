from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from sms import send_sms
from django.db.models.signals import post_save, pre_save
from patient_management.models import Patient
import uuid
from location_management.models import Location, Appointment
from functions import convertTime
import pyqrcode
from functions import removeFile
site = settings.DJANGO_SITE

class Vaccination(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, blank=True, null=True)
    manufacture = models.CharField(max_length=50, blank=True, null=True)
    vile_number = models.IntegerField(unique=True, blank=True, null=True)
    date_given = models.DateField(blank=True, null=True)
    admister_person = models.CharField(max_length=50, blank=True, null=True)
    arm = models.CharField(max_length=5, blank=True, null=True)
    dose_number = models.CharField(max_length=10, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True, default='Pending')

    class Meta:
        ordering = ['-date_given',]
    
    def __str__(self):
        return str(self.id)

@receiver(pre_save, sender=Vaccination)
def vaccination_pre_save(sender, instance, *args, **kwargs):
    print (instance.status)
    if instance.appointment.status == 'Checked In':
        if instance.status == 'Completed':
            qr = pyqrcode.create(f'{site}patient-info/{instance.patient.unique_id}')
            qr.png(f'qr_codes/{instance.patient.unique_id}.png', scale = 8)
            src = f'qr_codes/{instance.patient.unique_id}.png'
            subject, from_email, to = 'Woot! Woot!', 'jav1anpry5ce@javaughnpryce.live', instance.patient.email
            html_content = f'''
            <html>
                <body>
                    <p>Congratulations on receiving your {instance.dose_number} dose of the covid vaccine.</p>
                    <p>You can view this record along with your testing record at <a href="{site}patient-info/{instance.patient.unique_id}">{site}patient-info/{instance.patient.unique_id}</a></p>
                    <p>You may present the attached qr code to any business that requires proof of vaccination of results of latest testing.</p>
                </body>
            </html>
            '''
            text_content = ""
            msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
            msg.attach_alternative(html_content, "text/html")
            msg.content_subtype = "html"
            msg.attach_file(src)
            msg.send()
            removeFile(src)
            text = f'''Congratulations on receiving your {instance.dose_number} dose of the covid vaccine.
    You can view this record along with your testing record at {site}patient-info/{instance.patient.unique_id}
            '''
            send_sms(
            text.strip(),
            '+12065550100',
            [f'{instance.patient.phone},'],
            fail_silently=True
            )
            instance.appointment.status = "Completed"
            instance.appointment.save()

@receiver(post_save, sender=Vaccination)
def vaccination_post_save(sender, instance, created, *args, **kwargs):
    if created:
        subject, from_email, to = 'Appointment for COVID-19 Vaccine', 'jav1anpry5ce@javaughnpryce.live', instance.patient.email
        html_content = f'''
        <html>
            <body>
                <p>Your appointment for your {instance.manufacture} vaccine was successfully made for {instance.appointment.date.strftime('%d %B, %Y')} at {convertTime(instance.appointment.time)}.</p>
                <p>You can manage your appointment at <a href="{site}appointments/{instance.appointment.id}">{site}appointments/{instance.appointment.id}</a></p>
                <p>You can search for your appointment using the following code: {instance.appointment.shorten_id}</p>
            </body>
        </html>
        '''
        text_content = ""
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = "html"
        msg.send()
        text = f'''Your appointment for your {instance.manufacture} vaccine was successfully made for {instance.appointment.date.strftime('%d %B, %Y')} at {convertTime(instance.appointment.time)}.
You can manage your appointmnet at {site}appointments/{instance.appointment.id}
You can search for your appointment using the following code: {instance.appointment.shorten_id}
        '''
        send_sms(
        text.strip(),
        '+12065550100',
        [f'{instance.patient.phone},'],
        fail_silently=True
        )
