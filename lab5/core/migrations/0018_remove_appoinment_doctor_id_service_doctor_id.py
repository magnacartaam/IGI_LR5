# Generated by Django 5.0.6 on 2024-05-31 07:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_alter_service_service_type_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appoinment',
            name='doctor_id',
        ),
        migrations.AddField(
            model_name='service',
            name='doctor_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.doctorprofile'),
        ),
    ]