from django.contrib import admin
from .models import Location, Offer, Test, Appointment, Availability

class LocationConfig(admin.ModelAdmin):
    list_display = (
        'id',
        'value',
        'street_address',
        'city',
        'parish'
    )

class AppointmentConfig(admin.ModelAdmin):
    list_display = (
        'id',
        'patient',
        'location',
        'date',
        'status'
    )
    readonly_fields = ('id',)
    search_fields = ('status',)
    # ordering = ('date',)
    order_by = ('date',)

class OfferConfig(admin.ModelAdmin):
    list_display = (
        'location',
        'value',
    )

class TestConfig(admin.ModelAdmin):
    list_display = (
        'location',
        'value',
    )

class AvailabilityConfig(admin.ModelAdmin):
    list_display = ('date', 'time',)

admin.site.register(Location, LocationConfig)
admin.site.register(Offer, OfferConfig)
admin.site.register(Test, TestConfig)
admin.site.register(Appointment, AppointmentConfig)
admin.site.register(Availability, AvailabilityConfig)