# Generated by Django 3.2.9 on 2021-12-01 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0014_auto_20211201_0826'),
    ]

    operations = [
        migrations.AlterField(
            model_name='locationbatch',
            name='qr_image',
            field=models.ImageField(blank=True, null=True, upload_to='batch_qr/'),
        ),
    ]
