# Generated by Django 5.0.6 on 2024-05-30 15:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_alter_article_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='author',
        ),
        migrations.RemoveField(
            model_name='article',
            name='content',
        ),
        migrations.RemoveField(
            model_name='article',
            name='image',
        ),
        migrations.RemoveField(
            model_name='article',
            name='published_date',
        ),
        migrations.RemoveField(
            model_name='article',
            name='slug',
        ),
    ]
