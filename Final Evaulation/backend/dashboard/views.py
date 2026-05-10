from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages


# HOME PAGE
def home(request):

    return render(request, 'home.html')


# SIGNUP
def signup_view(request):

    if request.method == 'POST':

        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # PASSWORD CHECK
        if password != confirm_password:

            messages.error(request, 'Passwords do not match')

            return redirect('home')

        # USER EXISTS CHECK
        if User.objects.filter(username=username).exists():

            messages.error(request, 'Username already exists')

            return redirect('home')

        # CREATE USER
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # AUTO LOGIN
        login(request, user)

        return redirect('dashboard')

    return redirect('home')


# LOGIN
def login_view(request):

    if request.method == 'POST':

        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            return redirect('dashboard')

        else:

            messages.error(request, 'Invalid username or password')

            return redirect('home')

    return redirect('home')


# DASHBOARD
@login_required
def dashboard_view(request):

    return render(request, 'dashboard/dashboard.html')

@login_required
def doctor_dashboard_view(request):
    return render(request, 'dashboard/doctor_dashboard.html')

@login_required
def admin_dashboard_view(request):
    return render(request, 'dashboard/admin_dashboard.html')

@login_required
def chat_view(request):
    return render(request, 'dashboard/chat.html')


# LOGOUT
def logout_view(request):

    logout(request)

    return redirect('home')

def learn_view(request):
    return render(request, 'dashboard/learn.html')
