import graphene
from graphene_django import DjangoObjectType
from posts.models import Comment
from graphene import relay


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ('id', 'post', 'profile', 'content', 'created_at', 'replay')
        interfaces = (relay.Node,)  # mak

    replays = graphene.List(lambda: CommentType)
    raw_id = graphene.Int()

    def resolve_raw_id(self, info):
        return self.id  # Возвращает обычный ID

    def resolve_replays(self, info, **kwargs):
        return Comment.objects.filter(replay=self) 
    

class CommentsConnection(relay.Connection):
    class Meta:
        node = CommentType