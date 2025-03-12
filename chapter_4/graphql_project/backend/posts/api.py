from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from typing import List
from .models import Post, Comment
from django.contrib.auth.models import User
from datetime import datetime
from ninja import Schema
from ninja import NinjaAPI, Schema, UploadedFile, Form, File

api = NinjaAPI()

class PostOut(Schema):
    id: int
    title: str
    content: str
    image: str
    author: str
    created_at: datetime

class PostIn(Schema):
    title: str
    content: str
    author: str

class AuthenticationFailed(Schema):
    error: str


@api.post("/posts", response={200: PostOut, 401: AuthenticationFailed})
def create_post(request, payload: Form[PostIn], image: File[UploadedFile]):    
    post = Post.objects.create(
        title=payload.title,
        content=payload.content,
        image=image,
        author=User.objects.get(username=payload.author)
    )
    
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "image": post.image.url,
        "author": post.author.username,
        "created_at": post.created_at
    }

@api.get("/posts", response=List[PostOut])
def list_posts(request):
    posts = Post.objects.all()
    return [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "image": post.image.url,
            "author": post.author.username,
            "created_at": post.created_at
        }
        for post in posts
    ]

@api.get("/posts/{post_id}")
def get_post(request, post_id: int):
    post = get_object_or_404(Post, id=post_id)
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "image": post.image.url,
        "author": post.author.username,
        "created_at": post.created_at,
        "comments": [
            {
                "id": comment.id,
                "content": comment.content,
                "author": comment.author.username,
                "created_at": comment.created_at
            }
            for comment in post.comments.all()
        ]
    } 