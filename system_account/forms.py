from django.contrib.auth.models import User
from django.forms import ModelForm


class UpdateUserForm(ModelForm):
    class Meta:
        model = User
        fields = ('last_name', 'first_name', 'email')

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(UpdateUserForm, self).__init__(*args, **kwargs)
