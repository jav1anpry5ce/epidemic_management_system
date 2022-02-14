
from django.urls import path

from patient_management import views

urlpatterns = [
    path('patients/', views.MOHPatientView.as_view()),
    path('patients/<unique_id>', views.get_patient_object),
    path('patients/detailed/<trn>', views.get_detailed_patient_object),
    path('patients/create', views.CreatePatientView.as_view()),
    path('patients/verify/', views.verify),
    path('patients/detailed/verify/', views.accept),
    path('patients/update/code/', views.update_info_verify),
    path('patients/verify/code/', views.verify_code),
    path('patients/update', views.update_info),
    path('patients/details/<trn>', views.get_patient_details),
    path('patients/records/', views.get_patient_records),
    path('patients/records/link', views.get_patient_records_link),
    path('cases/<status>/', views.GetCases.as_view()),
    path('cases/<type>/<id>/', views.get_case),
    path('cases/update/<id>', views.update_case),
    # path('patient-info/', views.PatientView.as_view()),
    # path('create-patient/', views.CreatePatientView.as_view()),
    # path('verify-patient/', views.verify),
    # path('detailed-patient/', views.accept),
    # path('update-info-verify/', views.update_info_verify),
    # path('verify-code/', views.verify_code),
    # path('update-info/', views.update_info),
    # path('all-patients/', views.MOHPatientView.as_view()),
    # path('get-patient/<trn>', views.get_patient_details),
    # path('get-cases/<status>', views.GetCases.as_view()),
    # path('get-case/<type>/<id>', views.get_case),
    # path('update-case/<id>', views.update_case),
    path('graph/<int:year>/<int:month>/<str:parish>', views.graph),
    path('generate-csv/<date>/<type>', views.generate_cvs),
]