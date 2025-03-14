import strawberry
from strawberry import auto
from django.contrib.auth import get_user_model
from typing import List, Optional

@strawberry.django.type(get_user_model())
class UserType:
    id: auto
    username: auto
    email: auto
    first_name: auto
    last_name: auto

@strawberry.type
class ProfileQuery:
    @strawberry.field
    def users(self) -> List[UserType]:
        return get_user_model().objects.all()

    @strawberry.field
    def user(self, id: strawberry.ID) -> Optional[UserType]:
        return get_user_model().objects.filter(id=id).first()

    @strawberry.field
    def me(self, info) -> Optional[UserType]:
        if info.context.user.is_authenticated:
            return info.context.user
        return None