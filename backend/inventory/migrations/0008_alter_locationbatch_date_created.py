# Generated by Django 3.2.5 on 2021-09-28 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0007_alter_locationbatch_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='locationbatch',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
