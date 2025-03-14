import strawberry
import strawberry_django
from strawberry import auto
from posts.models import Comment
from typing import List, Optional
from datetime import datetime
from .post import PostType
from .profile import UserType


@strawberry_django.type(Comment)
class CommentType:
    id: auto
    content: auto
    created_at: datetime
    post: PostType
    profile: UserType

@strawberry.type
class CommentQuery:
    @strawberry.field
    def comments(self) -> List[CommentType]:
        return Comment.objects.all()

    @strawberry.field
    def comment(self, id: strawberry.ID) -> Optional[CommentType]:
        return Comment.objects.filter(id=id).first()