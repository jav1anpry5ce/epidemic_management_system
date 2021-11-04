from django.urls import path

from testing import views

urlpatterns = [
    path('testing/', views.TestingView.as_view()),
    path('testing-record/', views.TestView.as_view()),
]