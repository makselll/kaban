import strawberry
import asyncio
from strawberry.types import Info
from channels.layers import get_channel_layer
from posts.models import Comment
from posts.schemas.queries.comment import CommentType
from typing import AsyncGenerator
from posts.schemas.queries.profile import UserProfileType, UserType


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def comment_created(self, info: Info, post_id: strawberry.ID) -> AsyncGenerator[CommentType, None]:
        channel_name = info.context["ws"].channel_name
        channel_layer = get_channel_layer()
        group_name = "posts_" + post_id + "_comments"
        # Add user to WebSocket group
        await channel_layer.group_add(group_name, channel_name)

        try:
            async with info.context["ws"].listen_to_channel("comment_created", groups=[group_name]) as cm:
                async for message in cm:
                    print("message", message, flush=1)
                    profile_data = message["comment"].pop("profile")
                    user_data = profile_data.pop("user")
                    user = UserType(
                        id=user_data["id"],
                        email=user_data["email"],
                        first_name=user_data["first_name"],
                        last_name=user_data["last_name"],
                        username=user_data["username"]
                    )
                    profile = UserProfileType(
                        id=profile_data["id"], 
                        user=user,
                        avatar=profile_data["avatar"],
                        bio=profile_data["bio"]
                    )
                    yield CommentType(**message["comment"], profile=profile)
        finally:
            # Remove user from group on disconnect
            print("Removing from group:", group_name, channel_name, flush=1)
            await channel_layer.group_discard(group_name, channel_name)