import graphene
from .post import PostType
from .comment import CommentsConnection
from .profile import ProfileConnection, ProfileType
from posts.models import Post, Comment
from graphene import relay


class Query(graphene.ObjectType):
    posts = graphene.List(PostType)
    post = graphene.Field(PostType, id=graphene.Int())
    comments = relay.ConnectionField(CommentsConnection, post_id=graphene.Int(required=False))
    # profiles = relay.ConnectionField(ProfileConnection)
    profile = graphene.Field(ProfileType, id=graphene.Int())
    me = graphene.Field(ProfileType)

    def resolve_posts(self, info):
        return Post.objects.all()

    def resolve_post(self, info, id):
        return Post.objects.get(pk=id)

    def resolve_comments(self, info, post_id = None, **kwargs):
        if post_id is not None:
            return Comment.objects.filter(post_id=post_id)
        return Comment.objects.all()
    
    def resolve_me(self, info):
        print(info.context.user, flush=1)
        if info.context.user.is_anonymous:
            return None
        
        return info.context.user.profile


