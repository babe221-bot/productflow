from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/proposals/$', consumers.ProposalConsumer.as_asgi()),
]
