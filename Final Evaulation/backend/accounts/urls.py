from django.urls import path
from .views import *

urlpatterns = [

    path('', home, name='home'),

    path('register/', register_view, name='register'),

    path('login/', login_view, name='login'),

    path('dashboard/', dashboard, name='dashboard'),

    path('logout/', logout_view, name='logout'),

]