from django.db import models
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from sms import send_sms
from django.contrib.sites.models import Site
from django.db.models.signals import post_save
from patient_management.models import Patient
import uuid
from location_management.models import Location, Appointment
from functions import convertTime
site = Site.objects.get_current()

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
    
    def __str__(self):
        return str(self.id)

@receiver(post_save, sender=Vaccination)
def vaccination_post_save(sender, instance, created, *args, **kwargs):
    if created:
        subject, from_email, to = 'Appointment for COVID-19 Vaccine', 'donotreply@localhost', instance.patient.email
        html_content = f'''
        <html>
            <body>
                <p>Your appointment for your {instance.manufacture} vaccine was successfully made for {instance.appointment.date.strftime('%d %B, %Y')} at {convertTime(instance.appointment.time)}.</p>
                <p>You can manage your appointment at <a href="{site}appointment/management/{instance.appointment.id}">{site}appointment/management/{instance.appointment.id}</a></p>
                <p>You can search for your appointment using the following code: {instance.appointment.shorten_id}</p>
            </body>
        </html>
        '''
        text_content = ""
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = "html"
        msg.send()
        text = f'''Your appointment for your COVID-19 test was successfully made for {instance.appointment.date.strftime('%d %B, %Y')} at {convertTime(instance.appointment.time)}.\nYou can manage your appointmnet at {site}appointment/management/{instance.appointment.id}\nYou can search for your appointment using the following code: {instance.appointment.shorten_id}\n
        '''
        send_sms(
        text.strip(),
        '+12065550100',
        [f'{instance.patient.phone},'],
        fail_silently=True
        )