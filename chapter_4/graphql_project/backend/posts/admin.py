from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'author', 'content', 'created_at')
    list_filter = ('post', 'author', 'created_at')
    search_fields = ('content', 'author__username')