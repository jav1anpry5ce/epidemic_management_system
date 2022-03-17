
from django.urls import path

from location_management import views


urlpatterns = [
    path('location/', views.LocationView.as_view()),
    path('get-location/<parish>', views.get_location_by_parish),
    path('appointments/', views.AppointmentView.as_view()),
    path('get-appointment/<appointment_id>', views.get_appointment),
    path('manage/appointments/', views.AppointmentManagementView.as_view()),
    path('location/appointments/', views.LocationAppointments.as_view()),
    path('check-in-patient/<patient_id>', views.check_in_patient),
    path('previous-vaccine/', views.patient_vaccine),
    path('location-details/', views.breakdown),
    path('add-location/', views.add_location),
    path('get-breakdown/', views.get_breakdown),
    path('location-breakdown/', views.location_breakdown),
    path('appointment-search/<shorten_id>', views.search_appointments),
    path('get-checked-in/<type>', views.CheckedIn.as_view()),
    path('add-availability/', views.add_availability),
    path('get-availability/', views.GetAvailability.as_view()),
    path('delete-availability/<id>', views.delete_availability),
    path('cases/positive-cases', views.get_positive_cases),
    path('cases/hospitalized-cases', views.get_hospitalized),
    path('cases/death-cases', views.get_death),
    path('cases/recovered-cases', views.get_recovered),
    path('cases/test-administered', views.get_test_administered),
    path('cases/vaccine-administered', views.get_vaccine_administered),
]