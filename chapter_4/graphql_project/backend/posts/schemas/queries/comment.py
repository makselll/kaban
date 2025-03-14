import strawberry
import strawberry_django
from strawberry import auto
from posts.models import Comment
from typing import List
from datetime import datetime
from .profile import UserProfileType


@strawberry_django.type(Comment)
class CommentType:
    id: auto
    content: auto
    created_at: datetime
    profile: UserProfileType
    post_id: auto


@strawberry.type
class CommentQuery:
    comments: List[CommentType] = strawberry_django.field()


    @strawberry_django.field(name="comment")
    def resolve_comment(self, info, id: strawberry.ID) -> CommentType | None:
        return Comment.objects.filter(id=id).first()