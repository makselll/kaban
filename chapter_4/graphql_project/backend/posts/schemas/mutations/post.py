import graphene
from graphene_file_upload.scalars import Upload
from posts.models import Post
from django import forms
from ..queries.post import PostType
from .base import BlogModelFormMutation


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('title', 'content', 'image', 'profile')

    def __init__(self, *args, **kwargs):
        print(kwargs, flush=1)
        super().__init__(*args, **kwargs)


class UpdatePost(BlogModelFormMutation):
    post = graphene.Field(PostType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=False)
        content = graphene.String(required=False)
        image = Upload(required=True)

    class Meta:
        form_class = PostForm


class CreatePost(BlogModelFormMutation):
    post = graphene.Field(PostType)

    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        image = Upload(required=True)

    class Meta:
        form_class = PostForm
        exclude_fields = ('profile',)

    @classmethod
    def get_form_kwargs(cls, root, info, **input):
        print(input, flush=1)
        kwargs = super().get_form_kwargs(root, info, **input)
        kwargs["files"] = {"image": input.pop("image", None)}  # Важно!
        kwargs["data"]["profile"] = info.context.user.profile.id
        return kwargs