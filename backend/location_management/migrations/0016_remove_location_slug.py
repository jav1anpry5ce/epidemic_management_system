# Generated by Django 3.2.9 on 2021-12-03 14:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('location_management', '0015_location_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='slug',
        ),
    ]
