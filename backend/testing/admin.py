from django.contrib import admin
from .models import Testing

class TestingConfig(admin.ModelAdmin):
    list_display = (
        'id',
        'patient',
        'location',
        'type',
        'status',
    )
    readonly_fields = ('id',)
    search_fields = ('id',)
    ordering = ('status',)
    order_by = ('status',)

admin.site.register(Testing, TestingConfig)

