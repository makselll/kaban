import graphene
from graphene_django import DjangoObjectType
from posts.models import Post
from .comment import CommentType
class PostType(DjangoObjectType):
    profile_id = graphene.Int()
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'profile', 'created_at',)

    comments = graphene.List(CommentType)

    def resolve_comments(self, info):
        return self.comments.all()

    def resolve_profile_id(self, info):
        return self.profile.id
