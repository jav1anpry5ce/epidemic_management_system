from django.urls import path

from account import views


urlpatterns = [
    path('register/', views.create),
    path('activate/', views.activate),
    path('login/', views.login),
    path('logout', views.logout),
    path('reset-request/', views.resetRequest),
    path('reset/', views.resetPassword),
    path('change-password/', views.changePassword),
    path('staff/details/<user>', views.StaffDetails.as_view()),
    path('staff/update', views.update_staff),
]   