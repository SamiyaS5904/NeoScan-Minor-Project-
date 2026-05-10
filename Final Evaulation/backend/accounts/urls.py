from django.urls import path
from . import views


urlpatterns = [

    # HOME
    path(
        '',
        views.home,
        name='home'
    ),

    path(
        'learn/',
        views.learn,
        name='learn'
    ),

    path(
        'chat/',
        views.chat,
        name='chat'
    ),

    # DASHBOARDS
    path(
        'dashboard/',
        views.dashboard,
        name='dashboard'
    ),

    path(
        'doctor-dashboard/',
        views.doctor_dashboard,
        name='doctor_dashboard'
    ),

    path(
        'admin-dashboard/',
        views.admin_dashboard,
        name='admin_dashboard'
    ),

    # AUTH
    path(
        'register/',
        views.register_view,
        name='register'
    ),

    path(
        'login/',
        views.login_view,
        name='login'
    ),

    path(
        'logout/',
        views.logout_view,
        name='logout'
    ),
]