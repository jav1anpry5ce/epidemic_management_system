# Generated by Django 3.2.9 on 2021-12-03 13:05

from django.db import migrations, models
import location_management.models


class Migration(migrations.Migration):

    dependencies = [
        ('location_management', '0010_alter_appointment_shorten_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='shorten_id',
            field=models.CharField(blank=True, default=location_management.models.shorten_id_generator, max_length=10, null=True, unique=True),
        ),
    ]
