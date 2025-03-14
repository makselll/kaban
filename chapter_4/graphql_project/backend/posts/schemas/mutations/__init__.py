import strawberry
from .auth import AuthMutation
from .post import PostMutation
from .comment import CommentMutation

@strawberry.type
class Mutation(AuthMutation, PostMutation, CommentMutation):
    pass