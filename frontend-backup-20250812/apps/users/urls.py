from django.urls import path
from . import views

urlpatterns = [
    path('connect_wallet/', views.connect_wallet, name='connect_wallet'),
    path('disconnect_wallet/', views.disconnect_wallet, name='disconnect_wallet'),
]
