import datetime
from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.template.defaultfilters import slugify
import datetime
import pytz

utc=pytz.UTC

# Create your models here.
class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    speciality = models.CharField(max_length=100, null=True, blank=True)
    passport_id = models.CharField(max_length=20, null=True, blank=True)

    profile_pic = models.ImageField(blank=True, default="default_profile_pic.png")

    REQUIRED_FIELDS = ['email', 'phone_number', 'first_name', 'last_name']
    USERNAME_FIELD = 'username'

class Sponsor(models.Model):
    name = models.CharField(max_length=100, null=False)
    description = models.TextField(null=True)
    image = models.ImageField(blank=True, null=True)

class Article(models.Model):
    title = models.CharField(max_length=200, null=False)
    content = models.TextField(null=True)
    published_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(blank=True, null=True,)
    author = models.CharField(max_length=50, null=True, blank=True)
    slug = models.SlugField(null=True, blank=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(Article, self).save(*args, **kwargs)


class Discount(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    valid_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
    
    @property
    def is_past_due(self):
        if self.valid_until:
            return utc.localize(datetime.datetime.now()) > self.valid_until
        else:
            return False
    

class About(models.Model):
    about_us_description = models.TextField("Info about the company.")
    contacts_string = models.TextField("Info on how to contact us.")


class FAQ(models.Model):
    question = models.CharField(max_length=200)
    answer = models.TextField()

    def __str__(self):
        return self.question
    

class Vacancy(models.Model):
    job_name = models.CharField(max_length=50, null=False)
    description = models.TextField(max_length=500, null=False)

    def __str__(self) -> str:
        return self.job_name
    

class Workers_UID(models.Model):
    passport_id = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.passport_id
    

class Review(models.Model):
    user_profile = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    rating = models.IntegerField("Rating from 1 to 5", default=5, blank=False)
    text = models.TextField("Review text")
    published_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_profile.first_name} - {self.rating} of 5"


class Service_type(models.Model):
    name = models.CharField(max_length=50, default="service")
    description = models.TextField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.name


class DoctorProfile(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user_id.username


class Service(models.Model):
    service_type_id = models.ForeignKey(Service_type, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField("Service name", max_length=100)
    doctor_id = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, null=True)
    description = models.CharField("Service description", max_length=200)
    price = models.FloatField("Price")

    def __str__(self):
        return self.name
    

class Appoinment(models.Model):
    doctor_id = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    user_confirmed = models.BooleanField(default=False)
    doctor_confirmed = models.BooleanField(default=False)
    service_id = models.ForeignKey(Service, on_delete=models.CASCADE)