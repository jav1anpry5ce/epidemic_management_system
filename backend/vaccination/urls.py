from django.urls import path

from vaccination import views

urlpatterns = [
    path('vaccination/', views.VaccinationView.as_view()),
    path('vaccination-record/', views.VacView.as_view()),
]