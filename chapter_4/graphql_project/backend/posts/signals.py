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
        
        # Преобразуем комментарий в словарь для отправки
        comment_data = {
            "id": instance.id,
            "content": instance.content,
            "created_at": instance.created_at.isoformat(),
            "profile": {
                "id": instance.profile.id,
                "username": instance.profile.user.username,
            },
            "post": instance.post.id
        }
        
        # Отправляем сообщение в группу
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "comment_created",
                "comment": comment_data
            }
        ) 