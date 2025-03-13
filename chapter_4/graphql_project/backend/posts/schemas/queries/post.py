import graphene
from graphene_django import DjangoObjectType
from posts.models import Post

class PostType(DjangoObjectType):
    profile_id = graphene.Int()
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'profile', 'created_at',)

    def resolve_profile_id(self, info):
        return self.profile.id
