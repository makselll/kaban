import strawberry
from strawberry.file_uploads import Upload
from typing import Optional
from posts.models import Post
from ..queries.post import PostType
from .base import BaseMutation, ValidationErrorType

@strawberry.input
class CreatePostInput:
    title: str
    content: str
    image: Optional[Upload] = None

@strawberry.input
class UpdatePostInput:
    id: strawberry.ID
    title: Optional[str] = None
    content: Optional[str] = None
    image: Optional[Upload] = None

@strawberry.type
class PostMutation:
    @strawberry.mutation
    def create_post(self, info, input: CreatePostInput) -> PostType:
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        
        post = Post.objects.create(
            title=input.title,
            content=input.content,
            image=input.image,
            profile=info.context.user
        )
        return post

    @strawberry.mutation
    def update_post(self, info, input: UpdatePostInput) -> Optional[PostType]:
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        
        try:
            post = Post.objects.get(id=input.id, profile=info.context.user)
        except Post.DoesNotExist:
            return None
            
        if input.title:
            post.title = input.title
        if input.content:
            post.content = input.content
        if input.image:
            post.image = input.image
            
        post.save()
        return post

    @strawberry.mutation
    def delete_post(self, info, id: strawberry.ID) -> bool:
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        
        try:
            post = Post.objects.get(id=id, profile=info.context.user)
            post.delete()
            return True
        except Post.DoesNotExist:
            return False