# Generated by Django 4.2.1 on 2023-09-04 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AccountApp', '0013_alter_userledger1_user_alter_userledger2_user_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expenses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.FloatField()),
                ('expense', models.CharField(max_length=200)),
                ('frequency', models.CharField(max_length=100)),
                ('bucket', models.CharField(max_length=100)),
            ],
        ),
    ]
