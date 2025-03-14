import strawberry
import strawberry_django
from strawberry import auto
from posts.models import Post
from typing import List, Optional
from datetime import datetime
from .profile import UserProfileType
from .comment import CommentType

@strawberry_django.filter(Post)
class PostFilter:
    id: auto
    title: auto

@strawberry_django.type(Post, filters=PostFilter)
class PostType:
    id: auto
    title: auto
    content: auto
    image: Optional[str]
    created_at: datetime
    profile: UserProfileType
    comments: List[CommentType]


@strawberry.type
class PostQuery:
    posts: List[PostType] = strawberry_django.field()


    @strawberry_django.field(name="post")
    def resolve_post(self, info, id: strawberry.ID) -> PostType:
        post = Post.objects.filter(id=id).first()
        if not post:
            raise Exception("Post not found")
        return post
    
    @strawberry_django.field(name="myPosts")
    def resolve_my_posts(self, info) -> List[PostType]:
        return Post.objects.filter(profile=info.context.request.user.profile)
