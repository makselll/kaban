import strawberry
from typing import List, Optional
from .post import PostQuery
from .comment import CommentQuery
from .profile import ProfileQuery

@strawberry.type
class Query(PostQuery, CommentQuery, ProfileQuery):
    pass


