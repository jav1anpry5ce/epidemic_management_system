# Generated by Django 3.2.9 on 2021-12-04 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_management', '0019_auto_20211204_1653'),
    ]

    operations = [
        migrations.AlterField(
            model_name='positivecase',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False, unique=True),
        ),
    ]
