from django.contrib.auth.models import User
from django import forms

from plataforma.models import Profile


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        exclude = ('company', 'type',"socketsession")
