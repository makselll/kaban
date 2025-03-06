from ninja import NinjaAPI, Schema
from django.shortcuts import get_object_or_404
from typing import List
from datetime import datetime
from .models import Post
from django.contrib.auth.models import User

api = NinjaAPI()

class PostSchema(Schema):
    id: int
    title: str
    content: str
    author_id: int
    created_at: datetime
    updated_at: datetime

class PostCreateSchema(Schema):
    title: str
    content: str
    author_id: int

@api.get("/posts", response=List[PostSchema])
def list_posts(request):
    return Post.objects.all()

@api.get("/posts/{post_id}", response=PostSchema)
def get_post(request, post_id: int):
    return get_object_or_404(Post, id=post_id)

@api.post("/posts", response=PostSchema)
def create_post(request, post: PostCreateSchema):
    author = get_object_or_404(User, id=post.author_id)
    post_obj = Post.objects.create(
        title=post.title,
        content=post.content,
        author=author
    )
    return post_obj

@api.put("/posts/{post_id}", response=PostSchema)
def update_post(request, post_id: int, data: PostCreateSchema):
    post = get_object_or_404(Post, id=post_id)
    author = get_object_or_404(User, id=data.author_id)
    
    post.title = data.title
    post.content = data.content
    post.author = author
    post.save()
    
    return post

@api.delete("/posts/{post_id}")
def delete_post(request, post_id: int):
    post = get_object_or_404(Post, id=post_id)
    post.delete()
    return {"success": True} 