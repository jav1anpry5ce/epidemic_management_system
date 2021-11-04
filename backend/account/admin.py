from django.contrib import admin
from .models import UserAccount, ResetAccount, ActivateAccount
from django.contrib.auth.admin import UserAdmin

class UserAccountConfig(UserAdmin):
    search_fields = ("email", "username", "last_name")
    list_display = ("username", "email", "location", "last_login")
    readonly_fields = ('date_joined', 'last_login')
    fieldsets = (
        ('Personal Information', {'fields': ('email', 'username', 'first_name', 'last_name',)}),
    ('Permissions', {'fields': ('is_active', 'is_staff', 'is_moh_staff', 'is_moh_admin', 'is_location_admin', 'can_update_test', 'can_update_vaccine', 'can_check_in', 'can_receive_location_batch', 'is_superuser', 'groups',)}),
    ('Staff Information', {'fields': ('date_joined', 'last_login', 'location',)}),
    )
    add_fieldsets = (
        (None, {'fields': ('email', 'username', 'first_name', 'last_name', 'location', 'is_admin', 'password1', 'password2')}),
    )


class ResetAccountConfig(admin.ModelAdmin):
    fields = ('user',)
    list_display = ('token', 'user', 'created')
    readonly_fields = ('token',)


admin.site.register(UserAccount, UserAccountConfig)

# Register your models here.
