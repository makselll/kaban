from django import forms
import graphene
from graphene_django import DjangoObjectType
from graphene import relay
from posts.models import Post, Comment
from django.contrib.auth.models import User
from graphene_django.forms.mutation import DjangoModelFormMutation

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'author', 'created_at', 'comments')

class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ('id', 'post', 'author', 'content', 'created_at', 'replay')
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


class Query(graphene.ObjectType):
    posts = graphene.List(PostType)
    post = graphene.Field(PostType, id=graphene.Int())
    comments = relay.ConnectionField(CommentsConnection, post_id=graphene.Int(required=False))

    def resolve_posts(self, info):
        return Post.objects.all()

    def resolve_post(self, info, id):
        return Post.objects.get(pk=id)

    def resolve_comments(self, info, post_id = None, **kwargs):
        if post_id is not None:
            return Comment.objects.filter(post_id=post_id)
        return Comment.objects.all()


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('content', 'replay', 'post', 'author')

    def __init__(self, *args, **kwargs):
        print(kwargs, flush=1)
        super().__init__(*args, **kwargs)

class UpdateComment(DjangoModelFormMutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        id = graphene.Int(required=True)
        content = graphene.String(required=True)
        replay = graphene.Int(required=False)

    class Meta:
        form_class = CommentForm

class CreateComment(DjangoModelFormMutation):
    comment = graphene.Field(CommentType)
    class Arguments:
        post_id = graphene.Int(required=True)
        content = graphene.String(required=True)
        replay = graphene.Int(required=False)

    class Meta:
        form_class = CommentForm
        exclude_fields = ('author',)

    @classmethod
    def get_form_kwargs(cls, root, info, **input):
        kwargs = super().get_form_kwargs(root, info, **input)
        kwargs["data"]["author"] = 3

        return kwargs


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()

schema = graphene.Schema(query=Query, mutation=Mutation) 