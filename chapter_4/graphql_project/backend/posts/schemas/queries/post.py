import strawberry
from strawberry import auto
from posts.models import Post
from typing import List, Optional
from datetime import datetime
from .comment import CommentType
from .profile import UserType

@strawberry.django.type(Post)
class PostType:
    id: auto
    title: auto
    content: auto
    image: Optional[str]
    created_at: datetime
    profile: UserType

    comments = strawberry.field(lambda self: self.comments.all())

    def resolve_profile_id(self, info):
        return self.profile.id

@strawberry.type
class PostQuery:
    @strawberry.field
    def posts(self) -> List[PostType]:
        return Post.objects.all()

    @strawberry.field
    def post(self, id: strawberry.ID) -> Optional[PostType]:
        return Post.objects.filter(id=id).first()
