# Generated by Django 5.0.6 on 2024-05-30 15:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_article_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='slug',
            field=models.SlugField(blank=True, default='djangodbmodelsfieldscharfield'),
        ),
    ]
