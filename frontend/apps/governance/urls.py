from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_proposal, name='create_proposal'),
    path('', views.proposal_list, name='proposal_list'),
]
