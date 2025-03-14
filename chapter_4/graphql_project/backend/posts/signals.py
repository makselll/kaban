from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Comment


@receiver(post_save, sender=Comment)
def comment_created_signal(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        group_name = f"posts_{instance.post.id}_comments"


        # Convert comment to dictionary for sending
        comment_data = {
            "id": instance.id,
            "content": instance.content,
            "created_at": instance.created_at.isoformat(),
            "profile": {
                "id": instance.profile.id,
                "avatar": instance.profile.avatar,
                "bio": instance.profile.bio,
                "user": {
                    "username": instance.profile.user.username,
                    "id": instance.profile.user.id,
                    "email": instance.profile.user.email,
                    "first_name": instance.profile.user.first_name,
                    "last_name": instance.profile.user.last_name,
                },
            },
            "post_id": instance.post.id
        }
        
        # Send message to the group
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "comment_created",
                "room_id": group_name,
                "comment": comment_data
            }
        ) 
