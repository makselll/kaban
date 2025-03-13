import graphene
from .comment import UpdateComment, CreateComment
from .post import UpdatePost, CreatePost

class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()

    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()