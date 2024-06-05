# Generated by Django 5.0.6 on 2024-05-31 06:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_review'),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Service name')),
                ('description', models.CharField(max_length=200, verbose_name='Service description')),
                ('price', models.FloatField(verbose_name='Price')),
            ],
        ),
        migrations.CreateModel(
            name='Service_type',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='service', max_length=50)),
                ('description', models.TextField(blank=True, max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='DoctorProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Appoinment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_confirmed', models.BooleanField(default=False)),
                ('doctor_confirmed', models.BooleanField(default=False)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('doctor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.doctorprofile')),
                ('service_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.service')),
            ],
        ),
        migrations.AddField(
            model_name='service',
            name='service_type_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.service_type'),
        ),
    ]