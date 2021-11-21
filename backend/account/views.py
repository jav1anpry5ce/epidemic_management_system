from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from location_management.models import Location
from rest_framework.authtoken.models import Token
from .models import ResetAccount, ActivateAccount
from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.models import Site
from django.utils import timezone
import random
import string
from validate_email import validate_email
from functions import validate_password_strength

User = get_user_model()
site = Site.objects.get_current()

@api_view(['POST'])
def create(request):
    try:
        try:
            location = Location.objects.get(value=request.data.get('location'))
        except:
            if not request.user.is_moh_admin:
                return Response({"Message": "location entered is not valid!"}, status=status.HTTP_400_BAD_REQUEST)
            location = None
        password = ''.join(random.choice(string.printable) for i in range(8))
        if request.user.is_location_admin or request.user.is_moh_admin:
            if validate_email(request.data.get('email')):
                if not User.objects.filter(email=request.data.get('email')).exists():
                    if not User.objects.filter(username=request.data.get('username')).exists():
                        user = User.objects.create_user(email=request.data.get('email'), username=request.data.get('username'), 
                        first_name=request.data.get('first_name'), last_name=request.data.get('last_name'), location=location,
                        password=password)
                        if request.data.get('is_location_admin') == 1: 
                            user.is_location_admin = True
                        if request.data.get('can_update_test') == 1:
                            user.can_update_test = True
                        if request.data.get('can_update_vaccine') == 1:
                            user.can_update_vaccine = True
                        if request.data.get('can_check_in') == 1:
                            user.can_check_in = True
                        if request.data.get('can_receive_location_batch') == 1:
                            user.can_receive_location_batch = True
                        if request.data.get('is_moh_staff') == 1:
                            user.is_moh_staff = True
                        if request.data.get('is_moh_admin') == 1:
                            user.is_moh_admin = True
                        user.save()
                        activatToken = ActivateAccount.objects.create(user=user)
                        subject, from_email, to = 'Account Activation!', 'donotreply@localhost', user.email
                        html_content = f'''
                        <html>
                            <body>
                                <p>Hello {user.first_name}, welcome to our system!</p>
                                <p>Please go to the following link to activate your account.</p>
                                <p><a href="{site}account/activation/{activatToken.activate}/{activatToken.token}">{site}account/activation/{activatToken.activate}/{activatToken.token}</a></p>
                            </body>
                        </html>
                        '''
                        text_content = ""
                        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                        msg.attach_alternative(html_content, "text/html")
                        msg.content_subtype = "html"
                        msg.send()
                        return Response({"Message": "Account successfully created!"})
                    return Response({"Message": "This username is already taken!"}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"Message": "This email is already registered!"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"Message": "Email is not valid"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Message": "ummm... I don't think you are authorized to send this request."}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'Message': "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def activate(request):
    try:
        activate = request.data.get('activate')
        token = request.data.get('token')
        if ActivateAccount.objects.get(activate=activate, token=token):
            if request.data.get('password') == request.data.get('con_password'):
                if validate_password_strength(request.data.get('password')):
                    user = ActivateAccount.objects.get(activate=activate).user
                    user.is_active = True
                    user.set_password(request.data.get('password'))
                    user.save()
                    ActivateAccount.objects.get(user=user).delete()
                    subject, from_email, to = 'Account Activated!', 'donotreply@localhost', user.email
                    html_content = f'''
                    <html>
                        <body>
                            <p>Hello {user.first_name} your account has been sucessfully activated!</p>
                            <p>{f"Authorization Code: {user.location.authorization_code}" if user.can_receive_location_batch else ""}</p>
                        </body>
                    </html>
                    '''
                    text_content = ""
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.content_subtype = "html"
                    msg.send()
                    return Response(status=status.HTTP_202_ACCEPTED)
                return Response({'Message': 'password must contain at least one digit.\npassword must contain at least one special character.\npassword must contain at least one upper case letter'} ,status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'Password and confirm password must be the same!'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    try:
        try:
            user = User.objects.get(username=request.data.get('username'))
            if user.check_password(request.data.get('password')) and user.is_active:
                if user.is_moh_staff:
                    location = None
                else:
                    location = user.location.value
                token = Token.objects.create(user=user)
                user.last_login = timezone.now()
                user.save()
                return Response({
                    "auth_token": token.key, 
                    "username": user.first_name, 
                    "is_location_admin": user.is_location_admin, 
                    "is_moh_staff": user.is_moh_staff,
                    "is_moh_admin": user.is_moh_admin,
                    "can_update_test": user.can_update_test, 
                    "can_update_vaccine": user.can_update_vaccine, 
                    'can_check_in': user.can_check_in,
                    "can_receive_location_batch": user.can_receive_location_batch,
                    "location": location
                    })
            return Response({'Message': 'Check username and/or password'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            user = User.objects.get(username=request.data.get('username'))
            if user.check_password(request.data.get('password')):
                if user.is_moh_staff:
                    location = None
                else:
                    location = user.location.value
                token = Token.objects.get(user=user)
                user.last_login = timezone.now()
                user.save()
                return Response({
                    "auth_token": token.key, 
                    "username": user.first_name, 
                    "is_location_admin": user.is_location_admin, 
                    'is_moh_staff': user.is_moh_staff, 
                    'is_moh_admin': user.is_moh_admin, 
                    "can_update_test": user.can_update_test, 
                    "can_update_vaccine": user.can_update_vaccine, 
                    'can_check_in': user.can_check_in, 
                    "can_receive_location_batch": user.can_receive_location_batch,
                    "location": location})
            return Response({'Message': 'Check username and/or password'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'Message': 'Check username and/or password'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def logout(request):
    try:
        Token.objects.get(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except:
        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def resetRequest(request):
    try:
        try:
            user = User.objects.get(username=request.data.get('username'))
        except:
            return Response({'Message': 'username provided does not match any in our records!'}, status=status.HTTP_404_NOT_FOUND)
        if request.user.is_location_admin or request.user.is_moh_admin:
            if request.user.location == user.location and user.is_active or request.user.is_moh_admin:
                if ResetAccount.objects.get(user=user).delete():
                    reset = ResetAccount.objects.create(user=user)
                    subject, from_email, to = 'Reset Request', 'donotreply@localhost', user.email
                    text_content = 'This is an important message.'
                    html_content = f'''
                    <html>
                        <body>
                            <p>We have received your reset request. attached you will find the reset link.</p>
                            <a href="{site}password/reset/{reset.token}">{site}password/reset/{reset.token}</a>
                        </body>
                    </html>
                    '''
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    reset = ResetAccount.objects.create(user=user)
                    subject, from_email, to = 'Reset Request', 'donotreply@localhost', user.email
                    text_content = 'This is an important message.'
                    html_content = f'''
                    <html>
                        <body>
                            <p>We have received your reset request. attached you will find the reset link.</p>
                            <a href="{site}password/reset/{reset.token}">{site}password/reset/{reset.token}</a>
                        </body>
                    </html>
                    '''
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()
                    return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'Message': f'You are not authorized to make this request for {request.data.get("username")}'} , status=status.HTTP_401_UNAUTHORIZED)
        return Response({'Message': 'You are not authorized to make this request'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        try:
            if request.user.is_location_admin or request.user.is_moh_admin:
                if request.user.location == user.location or request.user.is_moh_admin:
                    reset = ResetAccount.objects.create(user=user)
                    subject, from_email, to = 'Reset Request', 'donotreply@localhost', user.email
                    text_content = 'This is an important message.'
                    html_content = f'''
                    <html>
                        <body>
                            <p>We have received your reset request. attached you will find the reset link.</p>
                            <a href="{site}password/reset/{reset.token}">{site}password/reset/{reset.token}</a>
                        </body>
                    </html>
                    '''
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                return Response({'Message': f'You are not authorized to make this request for {request.data.get("username")}'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'Message': 'You are not authorized to make this request'}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({'Message': 'You must be logged in to send this request'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def resetPassword(request):
    try:
        user = ResetAccount.objects.get(token=request.data.get('reset_token')).user
        if request.data.get('new_password') == request.data.get('con_password'):
            if validate_password_strength(request.data.get('new_password')):
                user.set_password(request.data.get('new_password'))
                user.save()
                ResetAccount.objects.get(token=request.data.get('reset_token')).delete()
                return Response(status=status.HTTP_202_ACCEPTED)
            return Response({'Message': 'password must contain at least one digit.\npassword must contain at least one special character.\npassword must contain at least one upper case letter'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'Confirm password must match password!'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'Message': 'Invalid Token!'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def changePassword(request):
    try:
        user = request.user
        if user.check_password(request.data.get('old_password')):
            if validate_password_strength(request.data.get('new_password')):
                if request.data.get('new_password') == request.data.get('con_password'):
                    if not request.data.get('new_password') == request.data.get('old_password'):
                        user.set_password(request.data.get('new_password'))
                        user.save()
                        return Response({'Message': 'Your password was sucessfully changed!'}, status=status.HTTP_204_NO_CONTENT)
                    return Response({'Message': 'New Password cannot be the same as old password!'}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'Message': 'Password does not match!'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'password must contain at least one digit.\npassword must contain at least one special character.\npassword must contain at least one upper case letter'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'The password you entered does not match the one on file!'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
