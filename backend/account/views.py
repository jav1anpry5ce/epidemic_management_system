from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
from location_management.models import Location
from rest_framework.authtoken.models import Token
from .models import ResetAccount, ActivateAccount, UserAccount
from .serializers import StaffSerializer, DetailedStaffSerializer
from django.utils import timezone
from rest_framework import filters
from django_filters import rest_framework as filterss
from rest_framework.pagination import PageNumberPagination
import random
import string
from validate_email import validate_email
from functions import validate_password_strength

User = get_user_model()

@api_view(['POST'])
def create(request):
    try:
        try:
            location = Location.objects.get(slug=request.data.get('location'))
        except:
            if not request.user.is_moh_admin or request.user.is_location_admin:
                return Response({"Message": "location entered is not valid!"}, status=status.HTTP_400_BAD_REQUEST)
            location = None
        password = ''.join(random.choice(string.printable) for i in range(8))
        if request.user.is_location_admin or request.user.is_moh_admin:
            if validate_email(request.data.get('email')):
                if not User.objects.filter(email=request.data.get('email')).exists():
                    user = User.objects.create_user(email=request.data.get('email'),
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
                    ActivateAccount.objects.create(user=user)
                    return Response({"Message": "Account successfully created!"})
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
                    return Response(status=status.HTTP_202_ACCEPTED)
                return Response({'Message': 'Password must be at lease 8 character in length, contain at least one digit,\nat least one special character and\nat least one upper case letter.'} ,status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'Password and confirm password must be the same!'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    if User.objects.filter(email=request.data.get('email')).exists():
        user = User.objects.get(email=request.data.get('email'))
        if user.is_active:
            if user.check_password(request.data.get('password')):
                if user.is_moh_staff:
                    location = None
                else:
                    location = user.location.slug
                if Token.objects.filter(user=user).exists():
                    Token.objects.get(user=user).delete()
                token = Token.objects.get_or_create(user=user)
                user.last_login = timezone.now()
                user.login_attempt = 0
                user.save()
                return Response({
                    "auth_token": token[0].key, 
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
            else:
                user.login_attempt += 1
                if user.login_attempt > 3:
                    user.is_active = False
                user.save()
                return Response({'Message': 'Check email and/or password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'Please contact your administrator!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Message': 'Check email and/or password'}, status=status.HTTP_400_BAD_REQUEST)

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
            user = User.objects.get(email=request.data.get('email'))
            user.login_attempt = 0
            user.save()
        except:
            return Response({'Message': 'email provided does not match any in our records!'}, status=status.HTTP_404_NOT_FOUND)
        if request.user.is_location_admin or request.user.is_moh_admin:
            if request.user.location == user.location and user.is_active or request.user.is_moh_admin:
                if ResetAccount.objects.filter(user=user).exists():
                    if ResetAccount.objects.get(user=user).delete():
                        ResetAccount.objects.create(user=user)
                        return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    ResetAccount.objects.create(user=user)
                    return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'Message': f'You are not authorized to make this request for {request.data.get("email")}'} , status=status.HTTP_401_UNAUTHORIZED)
        return Response({'Message': 'You are not authorized to make this request'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'Message': 'You must be logged in to send this request'}, status=status.HTTP_401_UNAUTHORIZED)
            

@api_view(['POST'])
def resetPassword(request):
    try:
        reset = ResetAccount.objects.get(token=request.data.get('reset_token'))
        user = reset.user
        if reset.expires > timezone.now():
            if request.data.get('new_password') == request.data.get('con_password'):
                if validate_password_strength(request.data.get('new_password')):
                    user.set_password(request.data.get('new_password'))
                    user.save()
                    ResetAccount.objects.get(token=request.data.get('reset_token')).delete()
                    return Response(status=status.HTTP_202_ACCEPTED)
                return Response({'Message': 'Password must be at lease 8 character in length, contain at least one digit,\nat least one special character and\nat least one upper case letter.'} ,status=status.HTTP_400_BAD_REQUEST)
            return Response({'Message': 'Confirm password must match password!'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'Reset token has expired please submit a new reset request.'}, status=status.HTTP_400_BAD_REQUEST)
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
            return Response({'Message': 'Password must be at lease 8 character in length, contain at least one digit,\nat least one special character and\nat least one upper case letter.'} ,status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'The password you entered does not match the one on file!'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'pageSize'


class StaffDetails(ListAPIView):
    filter_backends = [filterss.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    pagination_class = CustomPageNumberPagination
    search_fields = ['email', 'last_name']

    def get_queryset(self):
        if self.kwargs.get('user') == 'MOHADMIN':
            if self.request.user.is_authenticated and self.request.user.is_moh_admin:
                staffs = []
                moh_staff = UserAccount.objects.filter(is_moh_staff=True).exclude(email=self.request.user.email)
                site_admin = UserAccount.objects.filter(is_location_admin=True).exclude(email=self.request.user.email)
                for staff in moh_staff:
                    staffs.append(staff)
                for staff in site_admin:
                    staffs.append(staff)
                return staffs
            return []
        elif self.kwargs.get('user') == 'SITEADMIN':
            if self.request.user.is_authenticated and self.request.user.is_location_admin:
                location = self.request.user.location
                return UserAccount.objects.filter(location=location).exclude(email=self.request.user.email)
            return []
        else:
            return []

    def get_serializer_class(self):
        if self.kwargs.get('user') == 'MOHADMIN':
            return StaffSerializer
        elif self.kwargs.get('user') == 'SITEADMIN':
            return DetailedStaffSerializer
        else:
            return []

@api_view(['POST'])
def update_staff(request):
    try:
        if request.user.is_authenticated:
            staff = UserAccount.objects.get(email=request.data.get('email'))
            if request.user.is_location_admin:
                staff.is_active = request.data.get('is_active')
                staff.is_location_admin = request.data.get('is_location_admin')
                staff.can_update_test = request.data.get('can_update_test')
                staff.can_update_vaccine = request.data.get('can_update_vaccine')
                staff.can_receive_location_batch = request.data.get('can_receive_location_batch')
                staff.can_check_in = request.data.get('can_check_in')
                staff.save()
                return Response({'Message': 'Success'}, status=status.HTTP_204_NO_CONTENT)
            elif request.user.is_moh_admin:
                staff.is_active = request.data.get('is_active')
                staff.is_location_admin = request.data.get('is_location_admin')
                staff.is_moh_admin = request.data.get('is_moh_admin')
                staff.save()
                return Response({'Message': 'Success'}, status=status.HTTP_204_NO_CONTENT)
            return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message': 'You are not authorized to make this request.'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'Message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)
