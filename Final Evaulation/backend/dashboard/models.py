from django.db import models
from django.contrib.auth.models import User

class PatientSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_setting')
    scan_interval_hours = models.IntegerField(default=4)
    doctor_message = models.TextField(blank=True, null=True)
    alert_level = models.CharField(max_length=50, default='info') # info, warning, danger
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}"
