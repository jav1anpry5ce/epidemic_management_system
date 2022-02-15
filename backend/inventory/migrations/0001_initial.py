# Generated by Django 3.2.9 on 2022-02-15 00:11

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('location_management', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vaccine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=50)),
                ('value', models.CharField(max_length=50)),
                ('number_of_dose', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='LocationVaccine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=50)),
                ('value', models.CharField(max_length=50)),
                ('number_of_dose', models.IntegerField()),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='location_management.location')),
            ],
            options={
                'verbose_name': 'Site Vaccine',
            },
        ),
        migrations.CreateModel(
            name='LocationBatch',
            fields=[
                ('batch_id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('number_of_dose', models.IntegerField()),
                ('status', models.CharField(default='Dispatched', max_length=50)),
                ('qr_image', models.ImageField(blank=True, null=True, upload_to='batch_qr/')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='location_management.location')),
                ('vaccine', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='inventory.vaccine')),
            ],
            options={
                'verbose_name': 'Site Batch',
                'verbose_name_plural': 'Site Batches',
                'ordering': ('-date_created',),
            },
        ),
    ]
