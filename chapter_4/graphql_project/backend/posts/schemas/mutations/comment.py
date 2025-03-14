import strawberry
from typing import Optional
from posts.models import Comment, Post
from ..queries.comment import CommentType
from ..base import ValidationErrorType, BaseSuccess


@strawberry.input
class CreateCommentInput:
    post_id: strawberry.ID
    content: str
    parent_id: Optional[strawberry.ID] = None


@strawberry.input
class UpdateCommentInput:
    id: strawberry.ID
    content: str

@strawberry.type
class CommentMutation:

    @strawberry.mutation
    def create_comment(self, info, input: CreateCommentInput) -> CommentType | ValidationErrorType:
        if not info.context.user.is_authenticated:
            return ValidationErrorType(field="profile", message="Authentication required")
        
        try:
            post = Post.objects.get(id=input.post_id)
        except Post.DoesNotExist:
            return ValidationErrorType(field="post_id", message="Post not found")
            
        parent = None
        if input.parent_id:
            try:
                parent = Comment.objects.get(id=input.parent_id)
            except Comment.DoesNotExist:
                return ValidationErrorType(field="parent_id", message="Parent comment not found")
                
        comment = Comment.objects.create(
            content=input.content,
            post=post,
            profile=info.context.user,
            parent=parent
        )
        return comment

    @strawberry.mutation
    def update_comment(self, info, input: UpdateCommentInput) -> CommentType | ValidationErrorType:
        if not info.context.user.is_authenticated:
            return ValidationErrorType(field="profile", message="Authentication required")
        
        try:
            comment = Comment.objects.get(id=input.id, profile=info.context.user)
            comment.content = input.content
            comment.save()
            return comment
        except Comment.DoesNotExist:
            return ValidationErrorType(field="id", message="Comment not found")

    @strawberry.mutation
    def delete_comment(self, info, id: strawberry.ID) -> BaseSuccess | ValidationErrorType:
        if not info.context.user.is_authenticated:
            return ValidationErrorType(field="profile", message="Authentication required")
        
        try:
            comment = Comment.objects.get(id=id, profile=info.context.user)
            comment.delete()
            return True
        except Comment.DoesNotExist:
            return ValidationErrorType(field="id", message="Comment not found")