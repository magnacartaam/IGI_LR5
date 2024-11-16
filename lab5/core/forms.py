import re
import logging
from typing import Any
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate
from .models import User, Workers_UID


logger = logging.getLogger(__name__)


class DoctorRegistrationForm(UserCreationForm):
    speciality = forms.CharField(max_length=100, required=True)
    passport_id = forms.CharField(max_length=20, required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    phone_number = forms.CharField(max_length=15, required=True)

    profile_pic = forms.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username',
                  'email',
                  'phone_number',
                  'first_name',
                  'last_name',
                  'password1',
                  'password2',
                  'speciality',
                  'passport_id',
                  ]
        
    def clean_passport_id(self):
        passport_id = self.cleaned_data.get('passport_id')
        if not Workers_UID.objects.filter(passport_id=passport_id).exists():
            self.add_error('passport_id', "Invalid passport ID. This ID is not registered in System.")
        return passport_id


class ClientRegistrationForm(UserCreationForm):
    age = forms.IntegerField(required=True, min_value=18, max_value=100)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    phone_number = forms.CharField(max_length=15, required=True)

    class Meta:
        model = User
        fields = ['username',
                  'email',
                  'phone_number',
                  'first_name',
                  'last_name',
                  'password1',
                  'password2',
                  'age']
    
    def clean_age(self):
        age = self.cleaned_data.get('age')
        if age < 18:
            self.add_error('age', "Age must be at least 18.")
        return age

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if not re.match(r'^\+375\d{9}$', phone_number):
            self.add_error('phone_number', "Phone number must be entered in the format: '+375XXXXXXXXX'")
        return phone_number
    

class UserLoginForm(AuthenticationForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(attrs={'autofocus' : True})
    )
    password = forms.CharField(label="Password", strip=False, widget=forms.PasswordInput)

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        logger.debug(f"Trying to authenticate with username: {username} and password: {password}")

        # Authenticate by email or phone number
        user = authenticate(username=username, password=password)
        if not user:
            logger.debug("Authentication by user failed")
            user = authenticate(username, password=password)
            raise forms.ValidationError("Invalid login or password.")
        logger.debug(f"Authentication succeeded for user: {user}")
        self.cleaned_data['user'] = user
        return self.cleaned_data