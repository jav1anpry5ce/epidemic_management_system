from django.contrib import admin
from .models import Testing

class TestingConfig(admin.ModelAdmin):
    list_display = (
        'testing_id',
        'patient',
        'location',
        'type',
        'status',
    )
    readonly_fields = ('testing_id',)
    search_fields = ('testing_id',)
    ordering = ('status',)
    order_by = ('status',)

admin.site.register(Testing, TestingConfig)

