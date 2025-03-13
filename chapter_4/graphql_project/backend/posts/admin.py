from django.contrib import admin
from .models import Comment, Follow, Post, UserProfile

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'profile', 'content', 'created_at')
    list_filter = ('post', 'profile', 'created_at')
    search_fields = ('content', 'profile__username')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bio', 'avatar', 'date_of_birth', 'location', 'created_at', 'updated_at')
    list_filter = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username', 'location')


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('id', 'follower', 'following', 'created_at')
    list_filter = ('follower', 'following', 'created_at')
    search_fields = ('follower__username', 'following__username')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'profile', 'created_at', 'updated_at')
    list_filter = ('profile', 'created_at', 'updated_at')
    search_fields = ('title', 'profile__username')

