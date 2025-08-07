from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_proposal, name='create_proposal'),
    path('', views.proposal_list, name='proposal_list'),
 feat/backend-improvements
    path('vote/<int:proposal_id>/<str:vote_direction>/', views.cast_vote, name='cast_vote'),
    path('proposal_card/<int:proposal_id>/', views.get_proposal_card, name='get_proposal_card'),

 feat/backend-improvements
    path('vote/<int:proposal_id>/<str:vote_direction>/', views.cast_vote, name='cast_vote'),
    path('proposal_card/<int:proposal_id>/', views.get_proposal_card, name='get_proposal_card'),

 feat/backend-improvements
    path('vote/<int:proposal_id>/<str:vote_direction>/', views.cast_vote, name='cast_vote'),
    path('proposal_card/<int:proposal_id>/', views.get_proposal_card, name='get_proposal_card'),

 main
 main
 main
]
