from django.contrib import admin
from .models import Patient, PositiveCase, NextOfKin

class PatientConfig(admin.ModelAdmin):
    list_display = (
        'unique_id',
        'tax_number',
        'last_name',
        'parish'
    )
    readonly_fields = ('unique_id',)
    search_fields = ('tax_number', 'last_name', 'parish')

class NextOfKinConfig(admin.ModelAdmin):
    list_display = (
        'patient',
        'kin_first_name',
        'kin_last_name',
        'kin_phone',
        'kin_email',
    )
    search_fields = ('patient',)

admin.site.register(Patient, PatientConfig)
admin.site.register(NextOfKin, NextOfKinConfig)
admin.site.register(PositiveCase)
