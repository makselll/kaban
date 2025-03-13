import graphene
from graphene_django.forms.mutation import DjangoModelFormMutation
from posts.models import Comment
from django import forms
from ..queries.comment import CommentType


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('content', 'replay', 'post', 'profile')

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
        exclude_fields = ('profile',)

    @classmethod
    def get_form_kwargs(cls, root, info, **input):
        kwargs = super().get_form_kwargs(root, info, **input)
        kwargs["data"]["profile"] = 3

        return kwargs