from django.contrib.auth.models import User

from plataforma.models import Profile
from django.forms import ModelForm, fields_for_model, model_to_dict


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')


class ProfileForm(ModelForm):
    def __init__(self, instance=None, *args, **kwargs):
        _fields = ('first_name', 'last_name', 'email')
        _initial = model_to_dict(instance.user, _fields) if instance is not None else {}
        super(ProfileForm, self).__init__(initial=_initial, instance=instance, *args, **kwargs)
        self.fields.update(fields_for_model(User, _fields))

    class Meta:
        model = Profile
        exclude = ('user', 'company', 'type')

    def save(self, *args, **kwargs):
        u = self.instance.user
        u.first_name = self.cleaned_data['first_name']
        u.last_name = self.cleaned_data['last_name']
        u.email = self.cleaned_data['email']
        u.save()
        profile = super(ProfileForm, self).save(*args, **kwargs)
        return profile
