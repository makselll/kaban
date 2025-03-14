import strawberry
from typing import Optional
from posts.models import Comment, Post
from ..queries.comment import CommentType
from ..base import BaseSuccess
from strawberry_django.permissions import (
    IsAuthenticated,
)
from channels.layers import get_channel_layer
@strawberry.input
class CreateCommentInput:
    post_id: strawberry.ID
    content: str


@strawberry.input
class UpdateCommentInput:
    id: strawberry.ID
    content: str

@strawberry.type
class CommentMutation:

    @strawberry.mutation(extensions=[IsAuthenticated()])
    def create_comment(self, info, input: CreateCommentInput) -> CommentType:        
        try:
            post = Post.objects.get(id=input.post_id)
        except Post.DoesNotExist:
            raise Exception("Post not found")
                
        comment = Comment.objects.create(
            content=input.content,
            post=post,
            profile=info.context["request"].user.profile,
        )
        return comment

    @strawberry.mutation(extensions=[IsAuthenticated()])
    def update_comment(self, info, input: UpdateCommentInput) -> CommentType:
        try:
            comment = Comment.objects.get(id=input.id, profile=info.context["request"].user.profile)
            comment.content = input.content
            comment.save()
            return comment
        except Comment.DoesNotExist:
            raise Exception("Comment not found")

    @strawberry.mutation(extensions=[IsAuthenticated()])
    def delete_comment(self, info, id: strawberry.ID) -> BaseSuccess:
        try:
            comment = Comment.objects.get(id=id, profile=info.context["request"].user.profile)
            comment.delete()
            return True
        except Comment.DoesNotExist:
            raise Exception("Comment not found")
    