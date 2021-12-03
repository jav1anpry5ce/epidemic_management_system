# Generated by Django 3.2.9 on 2021-12-03 02:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vaccination', '0004_auto_20211128_1121'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vaccination',
            name='admister_person',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='vaccination',
            name='arm',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AlterField(
            model_name='vaccination',
            name='dose_number',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='vaccination',
            name='manufacture',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='vaccination',
            name='status',
            field=models.CharField(blank=True, default='Pending', max_length=50, null=True),
        ),
    ]
