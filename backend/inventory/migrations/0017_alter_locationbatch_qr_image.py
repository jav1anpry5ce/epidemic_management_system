# Generated by Django 3.2.9 on 2021-12-01 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0016_alter_locationbatch_qr_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='locationbatch',
            name='qr_image',
            field=models.ImageField(blank=True, null=True, upload_to='batch_qr/'),
        ),
    ]
