# Generated by Django 3.2.9 on 2021-12-05 02:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_management', '0023_rename_case_id_positivecase_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='positivecase',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]