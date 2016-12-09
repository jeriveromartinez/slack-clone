from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from plataforma.models import Snippet, Post


class LoginForm(forms.Form):
    email = forms.CharField(widget=forms.EmailInput(attrs={'placeholder': 'username@domain.com'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'password'}))


class MyRegistrationForm(UserCreationForm):
    company = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control"}))
    username = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control"}))
    first_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control"}))
    last_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control"}))
    email = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control"}))
    password1 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(attrs={'class': "form-control"}))
    password2 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(attrs={'class': "form-control"}))

    class Meta:
        model = User
        fields = ('last_name', 'first_name', 'username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])

        if commit:
            user.save()

        return user


class SnippetForm(forms.ModelForm):
    title = forms.CharField()
    code = forms.CharField(widget=forms.Textarea(
        attrs={'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'tabindex': '0', 'wrap': 'off'}))
    type = forms.ChoiceField(required=True, widget=forms.Select, choices=Snippet.CHOICE)

    class Meta:
        model = Snippet
        fields = ('title', "extension", 'code')


class PostForm(forms.ModelForm):
    title = forms.CharField()
    text = forms.CharField(widget=forms.Textarea(
        attrs={'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'tabindex': '0', 'wrap': 'off'}))

    class Meta:
        model = Post
        fields = ('title', 'text')
