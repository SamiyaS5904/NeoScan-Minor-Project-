from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'placeholder': 'Email address',
        'class': 'input-field',
    }))
    first_name = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'placeholder': 'Full name',
        'class': 'input-field',
    }))

    class Meta:
        model = User
        fields = ['username', 'first_name', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Username', 'class': 'input-field'}),
        }
