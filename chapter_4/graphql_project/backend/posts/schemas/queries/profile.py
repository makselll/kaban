import strawberry
import strawberry_django
from strawberry import auto
from django.contrib.auth import get_user_model
from typing import List
from posts.models import UserProfile
from strawberry_django.permissions import IsAuthenticated

@strawberry_django.type(get_user_model())
class UserType:
    id: auto
    username: auto
    email: auto
    first_name: auto
    last_name: auto


@strawberry_django.type(UserProfile)
class UserProfileType:
    id: auto
    user: UserType
    avatar: str | None
    bio: auto
    date_of_birth: auto
    location: auto

    @strawberry_django.field(name="isFollowed", extensions=[IsAuthenticated()])
    def resolve_is_followed(self, info) -> bool:
        if info.context["request"].user.profile.following.filter(following=self).exists():
            return True
        return False
    
    @strawberry_django.field(name="postsCount")
    def resolve_posts_count(self, info) -> int:
        return self.posts.count()
    
    @strawberry_django.field(name="followersCount")
    def resolve_followers_count(self, info) -> int:
        return self.followers.count()
    
    @strawberry_django.field(name="followingCount")
    def resolve_following_count(self, info) -> int:
        return self.following.count()


@strawberry.type
class ProfileQuery: 
    profiles: List[UserProfileType] = strawberry_django.field()

    @strawberry_django.field(name="profile")
    def resolve_profile(self, info, id: strawberry.ID) -> UserProfileType | None:
        return UserProfile.objects.filter(id=id).first()

    @strawberry_django.field(name="me", extensions=[IsAuthenticated()])
    def resolve_me(self, info) -> UserProfileType | None:
        return info.context["request"].user.profile

    
    @strawberry_django.field(name="isFollowing")
    def resolve_is_following(self, info) -> bool:
        return info.context["request"].user.profile.following.filter(following=self).exists()
    
    @strawberry_django.field(name="followers", extensions=[IsAuthenticated()])
    def resolve_followers(self, info) -> List[UserProfileType]:
        return UserProfile.objects.filter(following__follower=info.context["request"].user.profile).exclude(user=info.context["request"].user)
    
    @strawberry_django.field(name="following", extensions=[IsAuthenticated()])
    def resolve_following(self, info) -> List[UserProfileType]:
        return UserProfile.objects.filter(followers__follower=info.context["request"].user.profile)
