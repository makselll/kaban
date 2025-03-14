import strawberry
import asyncio
from strawberry.types import Info
from channels.layers import get_channel_layer
from posts.models import Comment
from posts.schemas.queries.comment import CommentType
from typing import AsyncGenerator


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def comment_created(self, info: Info, post_id: strawberry.ID) -> AsyncGenerator[CommentType, None]:
        channel_name = info.context["ws"].channel_name
        channel_layer = get_channel_layer()
        group_name = "posts_" + post_id + "_comments"

        # Добавляем пользователя в WebSocket-группу
        await channel_layer.group_add(group_name, channel_name)

        try:
            while True:
                # Ждем сообщения от канала
                message = await channel_layer.receive(channel_name)
                if message["type"] == "comment_created":
                    # Отправляем комментарий всем подписчикам в группе
                    await channel_layer.group_send(
                        group_name,
                        {
                            "type": "comment_created",
                            "comment": message["comment"]
                        }
                    )
                    yield CommentType(**message["comment"])
        finally:
            # Убираем пользователя из группы при отключении
            await channel_layer.group_discard(group_name, channel_name)