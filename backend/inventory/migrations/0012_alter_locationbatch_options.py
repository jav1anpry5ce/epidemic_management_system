# Generated by Django 3.2.9 on 2021-11-26 23:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0011_alter_locationbatch_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='locationbatch',
            options={'ordering': ('-date_created',)},
        ),
    ]
