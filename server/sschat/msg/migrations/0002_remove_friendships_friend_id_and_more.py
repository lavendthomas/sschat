# Generated by Django 4.0.4 on 2022-05-05 12:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('msg', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friendships',
            name='friend_id',
        ),
        migrations.RemoveField(
            model_name='friendships',
            name='user_id',
        ),
        migrations.AddField(
            model_name='friendships',
            name='friend',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='friendship_friend', to='msg.profile'),
        ),
        migrations.AddField(
            model_name='friendships',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='friendship_user', to='msg.profile'),
        ),
    ]