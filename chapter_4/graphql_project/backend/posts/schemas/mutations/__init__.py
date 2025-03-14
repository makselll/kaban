import strawberry
from .auth import AuthMutation
from .post import PostMutation
from .comment import CommentMutation
from .profile import ProfileMutation

@strawberry.type
class Mutation(AuthMutation, PostMutation, CommentMutation, ProfileMutation):
    pass