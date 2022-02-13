from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from location_management.models import Location
from django.utils import timezone
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.models import Site
from django.db.models.signals import post_save, post_delete

site = Site.objects.get_current()


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, ** extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    is_moh_admin = models.BooleanField(default=False)
    is_moh_staff = models.BooleanField(default=False)
    is_location_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    can_update_test = models.BooleanField(default=False)
    can_update_vaccine = models.BooleanField(default=False)
    can_check_in = models.BooleanField(default=False)
    can_receive_location_batch = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='uploads/', blank=True, null=True)

    class Meta:
        verbose_name = 'Staff Account'

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name

    def get_image(self):
        if self.profile_picture:
            return 'https://javaughnpryce.live:8001' + self.profile_picture.url
        return ''

    def __str__(self):
        return self.email


import string    
import random
from django.contrib.auth import get_user_model
User = get_user_model()

def tokenGenerator():
    S = 16
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran

def expire_gen():
    return timezone.now() + timedelta(minutes=60)

class ResetAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    token = models.CharField(max_length=16, unique=True, default=tokenGenerator)
    created = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    expires = models.DateTimeField(blank=True, null=True, default=expire_gen)

    class Meta:
        verbose_name = 'Reset Token'

    def __str__(self):
        return self.user.email

class ActivateAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    activate = models.CharField(max_length=16, unique=True, default=tokenGenerator)
    token = models.CharField(max_length=16, unique=True, default=tokenGenerator)
    created = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    def __str__(self):
        return self.user.email


@receiver(post_save, sender=ActivateAccount)
def account_post_save(sender, instance, created, *args, **kwargs):
    if created:
        subject, from_email, to = 'Account Activation!', 'donotreply@localhost', instance.user.email
        html_content = f'''
        <html>
            <body>
                <p>Hello {instance.user.first_name}, welcome to our system!</p>
                <p>Please go to the following link to activate your account.</p>
                <p><a href="{site}accounts/activation/{instance.activate}/{instance.token}">{site}accounts/activation/{instance.activate}/{instance.token}</a></p>
            </body>
        </html>
        '''
        text_content = ""
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = "html"
        msg.send()

@receiver(post_delete, sender=ActivateAccount)
def account_activated(sender, instance, *args, **kwargs):
    subject, from_email, to = 'Account Activated!', 'donotreply@localhost', instance.user.email
    html_content = f'''
    <html>
        <body>
            <p>Hello {instance.user.first_name} your account has been sucessfully activated!</p>
            <p>{f"Use the following authorization code to receive your site vaccination batches.</p> <p>Authorization Code: {instance.user.location.authorization_code}" if instance.user.can_receive_location_batch else ""}</p>
        </body>
    </html>
    '''
    text_content = ""
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.content_subtype = "html"
    msg.send()

@receiver(post_save, sender=ResetAccount)
def reset_token_post_save(sender, instance, created, *args, **kwargs):
    if created:
        subject, from_email, to = 'Reset Request', 'donotreply@localhost', instance.user.email
        text_content = 'This is an important message.'
        html_content = f'''
        <html>
            <body>
                <p>We have received your reset request. attached you will find the reset link.</p>
                <a href="{site}accounts/password/reset/{instance.token}">{site}accounts/password/reset/{instance.token}</a>
                <p><b>This link expires in 1 hour.</b></p>
            </body>
        </html>
        '''
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
