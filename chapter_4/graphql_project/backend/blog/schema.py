import graphene
from graphene_django import DjangoObjectType
from posts.models import Post, Comment
from django.contrib.auth.models import User

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
        fields = ('id', 'post', 'author', 'content', 'created_at')

class Query(graphene.ObjectType):
    posts = graphene.List(PostType)
    post = graphene.Field(PostType, id=graphene.Int())
    comments = graphene.List(CommentType, post_id=graphene.Int())

    def resolve_posts(self, info):
        return Post.objects.all()

    def resolve_post(self, info, id):
        return Post.objects.get(pk=id)

    def resolve_comments(self, info, post_id):
        return Comment.objects.filter(post_id=post_id)

class CreateComment(graphene.Mutation):
    class Arguments:
        post_id = graphene.Int(required=True)
        content = graphene.String(required=True)

    comment = graphene.Field(CommentType)

    def mutate(self, info, post_id, content):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('You must be logged in to add a comment')
        
        post = Post.objects.get(pk=post_id)
        comment = Comment.objects.create(
            post=post,
            author=user,
            content=content
        )
        return CreateComment(comment=comment)

class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()

schema = graphene.Schema(query=Query, mutation=Mutation) 