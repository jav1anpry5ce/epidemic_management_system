# Generated by Django 3.2.9 on 2021-12-04 00:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('location_management', '0018_alter_appointment_shorten_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Availability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('time', models.TimeField(blank=True, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='location',
            name='availability',
            field=models.ManyToManyField(to='location_management.Availability'),
        ),
    ]