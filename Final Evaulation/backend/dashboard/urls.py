from django.urls import path
from . import views
from .views import dashboard_view, learn_view, doctor_dashboard_view, admin_dashboard_view, home, chat_view
from .api_views import predict_bilirubin, chat_with_neobot, calibrate_lighting, get_patient_settings, update_patient_settings

urlpatterns = [
    path('learn/', learn_view, name='learn'),
    path('', home, name='home'),
    path('dashboard/', dashboard_view, name='dashboard_view'),
    path('doctor/', doctor_dashboard_view, name='doctor_dashboard'),
    path('admin-panel/', admin_dashboard_view, name='admin_dashboard'),
    path('chat/', chat_view, name='chat'),
    path('api/predict/', predict_bilirubin, name='predict_bilirubin'),
    path('api/calibrate/', calibrate_lighting, name='calibrate_lighting'),
    path('api/chat/', chat_with_neobot, name='chat_with_neobot'),
    path('api/get_patient_settings/', get_patient_settings, name='get_patient_settings'),
    path('api/update_patient_settings/', update_patient_settings, name='update_patient_settings'),
]
