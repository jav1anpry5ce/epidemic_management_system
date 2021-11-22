from django.urls import path

from inventory import views

urlpatterns = [
    path('batches/', views.Batches.as_view()),
    path('location-batch/', views.BatchView.as_view()),
    path('get-location-batchs/', views.LocationBatchList.as_view()),
    path('batch-info/', views.get_new_batch_info),
    path('update-batch/', views.receive_batch),
]
