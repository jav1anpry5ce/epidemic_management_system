from django.db import models
import uuid
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from sms import send_sms
from django.contrib.sites.models import Site
from django.db.models.signals import post_save, pre_save
from patient_management.models import Patient
from location_management.models import Location, Appointment
from functions import convertTime
from patient_management.models import PositiveCase
import pyqrcode
from functions import removeFile

site = Site.objects.get_current()



class Testing(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, blank=True, null=True)
    location = models.ForeignKey(Location, blank=True, null=True, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    result = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True, default='Pending')

    def __str__(self):
        return str(self.id)


@receiver(post_save, sender=Testing)
def testing_post_save(sender, instance, created, *args, **kwargs):
    if created:
        subject, from_email, to = 'Appointment for COVID-19 Test', 'jav1anpry5ce@javaughnpryce.live', instance.patient.email
        html_content = f'''
        <html>
            <body>
                <p>Your appointment for your COVID-19 test was successfully made for {instance.appointment.date.strftime('%d %B, %Y')} at {convertTime(instance.appointment.time)}.</p>
                <p>You can manage your appointmnet at <a href="{site}appointments/{instance.appointment.id}">{site}appointments/{instance.appointment.id}</a></p>
                <p>You can search for your appointment using the following code: {instance.appointment.shorten_id}</p>
            </body>
        </html>
        '''
        text_content = ''
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = 'html'
        msg.send()
        text = f'''Your appointment for your COVID-19 test was successfully made for {instance.appointment.date.strftime('%d %B, %Y')} at {convertTime(instance.appointment.time)}.\nYou can manage your appointmnet at {site}appointments/{instance.appointment.id}\nYou can search for your appointment using the following code: {instance.appointment.shorten_id}\n
        '''
        send_sms(
        text.strip(),
        '+12065550100',
        [f'{instance.patient.phone},'],
        fail_silently=True
        )

@receiver(pre_save, sender=Testing)
def testing_pre_save(sender, instance, *args, **kwargs):
    if instance.appointment.status == 'Checked In':
        if instance.result:
            instance.appointment.status = 'Completed'
            instance.appointment.save()
            instance.status = 'Completed'
            qr = pyqrcode.create(f'{site}patient-info/{instance.patient.unique_id}')
            qr.png(f'qr_codes/{instance.patient.unique_id}.png', scale = 8)
            src = f'qr_codes/{instance.patient.unique_id}.png'
            subject, from_email, to = '💅', 'jav1anpry5ce@javaughnpryce.live', instance.patient.email
            if instance.result == 'Positive':
                PositiveCase.objects.create(patient=instance.patient, recovering_location='Home', date_tested=instance.date)
            html_content = f'''
            <html>
                <body>
                    <p>Your COVID-19 {instance.type} test result is here!</p>
                    {f"{'<p>Unfortunately you have tested positive for COVID-19. You will be contacted soon with instructions on how to proceed.</p>' if instance.result == 'Positive' else ''}"}
                    <p>You can view this record along with your vaccination record at <a href="{site}patient-info/{instance.patient.unique_id}">{site}patient-info/{instance.patient.unique_id}</a></p>
                    <p>You may present the attached qr code to any business that requires proof of vaccination or latest test results.</p>
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
            text = f'''Your COVID-19 {instance.type} test result is here!
{f"{'Unfortunately you have tested positive for COVID-19. You will be contacted soon with instructions on how to proceed.' if instance.result == 'Positive' else ''}"}
You can view this record along with your vaccination record at {site}patient-info/{instance.patient.unique_id}
            '''
            send_sms(
            text.strip(),
            '+12065550100',
            [f'{instance.patient.phone},'],
            fail_silently=True
            )
    
