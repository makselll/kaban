import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from posts.models import Comment, Post, UserProfile

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'comments'
        self.room_group_name = f"post_{self.scope['url_route']['kwargs']['post_id']}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        post_id = text_data_json['post_id']
        content = text_data_json['content']
        user_id = text_data_json['user_id']

        comment = await self.create_comment(post_id, content, user_id)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'new_comment',
                'comment': {
                    'id': comment.id,
                    'content': comment.content,
                    'profile': comment.profile.user.username,
                    'created_at': comment.created_at.isoformat()
                }
            }
        )

    @database_sync_to_async
    def create_comment(self, post_id, content, profile_id):
        profile = UserProfile.objects.get(id=profile_id)
        post = Post.objects.get(id=post_id)
        return Comment.objects.create(
            post=post,
            profile=profile,
            content=content
        ) 
    
    async def new_comment(self, event):
        await self.send(text_data=json.dumps(event))
