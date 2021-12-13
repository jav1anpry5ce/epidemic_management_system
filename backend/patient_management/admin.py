from django.contrib import admin
from .models import Patient, PositiveCase, NextOfKin, Representative, DeathCase, RecoveredCase, HospitalizedCase

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

class RepresentativeConfig(admin.ModelAdmin):
    list_display = (
        'patient',
        'rep_first_name',
        'rep_last_name',
        'rep_email',
        'rep_phone',
    )
    search_fields = ('patient',)

class PositiveCaseConfig(admin.ModelAdmin):
    list_display = (
        'id',
        'patient',
        'date_tested',
        'recovering_location',
        'status',
        'last_updated',
    )

class DeathCaseConfig(admin.ModelAdmin):
    list_display = (
        'patient',
        'death_date',
        'last_updated',
    )

class RecoveredCaseConfig(admin.ModelAdmin):
    list_display = (
        'patient',
        'recovery_date',
        'last_updated',
    )

class HospitalizedCaseConfig(admin.ModelAdmin):
    list_display = (
        'patient',
        'hospitalized_date',
        'last_updated',
    )

admin.site.register(Patient, PatientConfig)
admin.site.register(NextOfKin, NextOfKinConfig)
admin.site.register(PositiveCase, PositiveCaseConfig)
admin.site.register(Representative, RepresentativeConfig)
admin.site.register(DeathCase, DeathCaseConfig)
admin.site.register(RecoveredCase, RecoveredCaseConfig)
admin.site.register(HospitalizedCase, HospitalizedCaseConfig)
