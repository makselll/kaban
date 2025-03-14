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
    avatar: auto
    bio: auto

    @strawberry_django.field(name="isFollowed", extensions=[IsAuthenticated()])
    def resolve_is_followed(self, info) -> bool:
        if info.context["request"].user.profile.following.filter(following=self).exists():
            return True
        return False


@strawberry.type
class ProfileQuery: 
    profiles: List[UserProfileType] = strawberry_django.field()

    @strawberry_django.field(name="profile")
    def resolve_profile(self, info, id: strawberry.ID) -> UserProfileType | None:
        return UserProfile.objects.filter(id=id).first()

    @strawberry_django.field(name="me")
    def resolve_me(self, info) -> UserProfileType | None:
        if info.context["request"].user.is_authenticated:
            return info.context["request"].user.profile
        return None
    
    @strawberry_django.field(name="isFollowing")
    def resolve_is_following(self, info) -> bool:
        return info.context["request"].user.profile.following.filter(following=self).exists()
    