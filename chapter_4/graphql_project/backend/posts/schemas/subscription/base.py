import strawberry
from typing import AsyncGenerator
from posts.models import Post, Comment
from ..queries.post import PostType
from ..queries.comment import CommentType

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def post_created(self) -> AsyncGenerator[PostType, None]:
        async for post in Post.objects.subscribe_to_create():
            yield post

    @strawberry.subscription
    async def post_updated(self) -> AsyncGenerator[PostType, None]:
        async for post in Post.objects.subscribe_to_update():
            yield post

    @strawberry.subscription
    async def post_deleted(self) -> AsyncGenerator[PostType, None]:
        async for post in Post.objects.subscribe_to_delete():
            yield post

    @strawberry.subscription
    async def comment_created(self) -> AsyncGenerator[CommentType, None]:
        async for comment in Comment.objects.subscribe_to_create():
            yield comment

    @strawberry.subscription
    async def comment_updated(self) -> AsyncGenerator[CommentType, None]:
        async for comment in Comment.objects.subscribe_to_update():
            yield comment

    @strawberry.subscription
    async def comment_deleted(self) -> AsyncGenerator[CommentType, None]:
        async for comment in Comment.objects.subscribe_to_delete():
            yield comment