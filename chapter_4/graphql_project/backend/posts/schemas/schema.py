import strawberry
from strawberry import auto
from strawberry.file_uploads import Upload
from django.contrib.auth import get_user_model
from posts.models import Post, Comment
from typing import List, Optional
from datetime import datetime

@strawberry.django.type(Post)
class PostType:
    id: auto
    title: auto
    content: auto
    image: Optional[str]
    created_at: datetime
    profile: 'UserType'
    comments: List['CommentType']

@strawberry.django.type(Comment)
class CommentType:
    id: auto
    content: auto
    created_at: datetime
    post: PostType
    profile: 'UserType'

@strawberry.django.type(get_user_model())
class UserType:
    id: auto
    username: auto
    email: auto
    posts: List[PostType]
    comments: List[CommentType]

@strawberry.type
class Query:
    @strawberry.field
    def posts(self) -> List[PostType]:
        return Post.objects.all()

    @strawberry.field
    def post(self, id: strawberry.ID) -> Optional[PostType]:
        return Post.objects.filter(id=id).first()

    @strawberry.field
    def me(self, info) -> Optional[UserType]:
        if info.context.user.is_authenticated:
            return info.context.user
        return None

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_post(
        self,
        info,
        title: str,
        content: str,
        image: Optional[Upload] = None
    ) -> PostType:
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        
        post = Post.objects.create(
            title=title,
            content=content,
            image=image,
            profile=info.context.user
        )
        return post

    @strawberry.mutation
    def update_post(
        self,
        info,
        id: strawberry.ID,
        title: Optional[str] = None,
        content: Optional[str] = None,
        image: Optional[Upload] = None
    ) -> PostType:
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        
        post = Post.objects.get(id=id, profile=info.context.user)
        if title:
            post.title = title
        if content:
            post.content = content
        if image:
            post.image = image
        post.save()
        return post

    @strawberry.mutation
    def delete_post(self, info, id: strawberry.ID) -> bool:
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        
        post = Post.objects.get(id=id, profile=info.context.user)
        post.delete()
        return True

schema = strawberry.Schema(query=Query, mutation=Mutation) 