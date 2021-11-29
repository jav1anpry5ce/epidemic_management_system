from django.contrib import admin
from .models import Vaccination

class VaccinationConfig(admin.ModelAdmin):
    list_display = (
        'id',
        'patient',
        'location',
        'manufacture',
        'status'
    )
    readonly_fields = ('id',)
    order_by = ('status',)
    ordering = ('status',)

admin.site.register(Vaccination, VaccinationConfig)
