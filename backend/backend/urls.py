from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('patient_management.urls')),
    path('api/', include('vaccination.urls')),
    path('api/', include('testing.urls')),
    path('api/', include('location_management.urls')),
    path('api/', include('inventory.urls')),
    path('auth/', include('account.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
