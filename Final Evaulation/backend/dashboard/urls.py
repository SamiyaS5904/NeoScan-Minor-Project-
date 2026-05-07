from django.urls import path
from .views import dashboard_view, home
from .api_views import predict_bilirubin, chat_with_neobot

urlpatterns = [
    path('', home, name='home'),
    path('dashboard/', dashboard_view, name='dashboard_view'),
    path('api/predict/', predict_bilirubin, name='predict_bilirubin'),
    path('api/chat/', chat_with_neobot, name='chat_with_neobot'),
]
