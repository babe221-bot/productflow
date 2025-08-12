import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ProposalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'proposals'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        pass

    # Receive message from room group
    async def proposal_update(self, event):
        proposal_id = event['proposal_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'proposal_id': proposal_id
        }))
