import strawberry
from django.contrib.auth import get_user_model, authenticate, login
from typing import Optional
import strawberry_django
from strawberry import auto
from ..queries.profile import UserProfileType
from django.db.models import Q
@strawberry.input
class RegisterInput:
    username: str
    email: str
    password: str
    password2: str


@strawberry_django.type(get_user_model())
class User:
    username: auto
    email: auto


@strawberry.type
class AuthMutation:

    logout = strawberry_django.auth.logout()

    @strawberry_django.field(name="register")
    def resolve_register(self, info, input: RegisterInput) -> UserProfileType:

        if User.objects.filter(Q(username=input.username) | Q(email=input.email)).exists():
            raise Exception("User already exists")
        
        if input.password != input.password2:
            raise Exception("Passwords do not match")

        user = User.objects.create_user(
            username=input.username,
            email=input.email,
            password=input.password,
        )
        return user.profile
    

    @strawberry_django.field(name="login")
    def login(self, info, username: str, password: str) -> UserProfileType:
        user = authenticate(username=username, password=password)
        if not user:
            raise Exception("Invalid credentials")
        login(info.context["request"], user)
        return user.profile
