
from django.urls import path

from patient_management import views

urlpatterns = [
    path('patient-info/', views.PatientView.as_view()),
    path('create-patient/', views.CreatePatientView.as_view()),
    path('verify-patient/', views.verify),
    path('detailed-patient/', views.accept),
    path('update-info-verify/', views.update_info_verify),
    path('verify-code/', views.verify_code),
    path('update-info/', views.update_info),
    path('all-patients/', views.MOHPatientView.as_view()),
    path('get-patient/<trn>', views.get_patient),
    path('get-positive-cases/', views.GetPositiveCases.as_view()),
    path('get-case/<case_id>', views.get_case),
    path('update-case/<case_id>', views.update_case),
    path('graph/<int:year>/<int:month>', views.graph),
]