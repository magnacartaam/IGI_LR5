# Generated by Django 5.0.6 on 2024-05-30 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_remove_user_user_type_user_age_user_passport_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Workers_UID',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('passport_id', models.CharField(max_length=20, unique=True)),
            ],
        ),
    ]