from django.contrib import admin
from .models import Vaccine, LocationVaccine, LocationBatch

class VaccineConfig(admin.ModelAdmin):
    list_display = (
        'value',
        'number_of_dose',
    )
    order_by = ('type',)

class LocationVaccineConfig(admin.ModelAdmin):
    list_display = (
        'location',
        'value',
        'number_of_dose',
    )
    order_by = ('value',)

class LocationBatchConfig(admin.ModelAdmin):
    list_display = (
        'batch_id',
        'location',
        'number_of_dose',
        'date_created',
        'status',
        'last_updated',
    )
    ordering = ('-date_created',)

admin.site.register(Vaccine, VaccineConfig)
admin.site.register(LocationVaccine, LocationVaccineConfig)
admin.site.register(LocationBatch, LocationBatchConfig)
