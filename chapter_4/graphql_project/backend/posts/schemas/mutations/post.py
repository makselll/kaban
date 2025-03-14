import strawberry
from strawberry.file_uploads import Upload
from posts.models import Post
from ..queries.post import PostType
from ..base import BaseSuccess
from strawberry_django.permissions import (
    IsAuthenticated,
)


@strawberry.input
class CreatePostInput:
    title: str
    content: str
    image: Upload = None

@strawberry.input
class UpdatePostInput:
    id: strawberry.ID
    title: str | None = None
    content: str | None = None
    image: Upload | None = None

@strawberry.type
class PostMutation:
    @strawberry.mutation(extensions=[IsAuthenticated()])
    def create_post(self, info, input: CreatePostInput) -> PostType:
        user = info.context.request.user
        
        post = Post.objects.create(
            title=input.title,
            content=input.content,
            image=input.image,
            profile=user.profile
        )
        return post

    @strawberry.mutation(extensions=[IsAuthenticated()])
    async def update_post(self, info, input: UpdatePostInput) -> PostType:        
        try:
            post = await Post.objects.aget(id=input.id, profile__user=info.context.request.user)
        except Post.DoesNotExist:
            raise Exception("Post not found")
            
        if input.title:
            post.title = input.title
        if input.content:
            post.content = input.content
        if input.image:
            post.image = input.image
            
        await post.asave()
        return post

    @strawberry.mutation(extensions=[IsAuthenticated()])
    async def delete_post(self, info, id: strawberry.ID) -> bool:        
        try:
            post = await Post.objects.aget(id=id, profile__user=info.context.request.user)
            await post.adelete()
            return True
        except Post.DoesNotExist:
            raise Exception("Post not found")