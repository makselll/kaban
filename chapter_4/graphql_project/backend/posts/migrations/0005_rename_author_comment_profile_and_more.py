# Generated by Django 5.0.3 on 2025-03-13 05:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_alter_comment_author_alter_follow_follower_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='author',
            new_name='profile',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='author',
            new_name='profile',
        ),
    ]
