
from django.urls import path

from appointment import views

urlpatterns = [
    path('appointments/', views.AppointmentView.as_view()),
    path('manage/appointments/', views.AppointmentManagementView.as_view())
]