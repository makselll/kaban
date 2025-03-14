import strawberry
from django.contrib.auth import get_user_model, authenticate, login, logout
from typing import Optional
from .base import ValidationErrorType, BaseSuccess


@strawberry.input
class LoginInput:
    username: str
    password: str

@strawberry.input
class RegisterInput:
    username: str
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

@strawberry.type
class AuthMutation:
    @strawberry.mutation
    def login(self, info, input: LoginInput) -> Optional[ValidationErrorType]:
        user = authenticate(
            username=input.username,
            password=input.password
        )
        
        if user is None:
            return ValidationErrorType(
                field="credentials",
                message="Invalid credentials"
            )
            
        login(info.context, user)
        return None

    @strawberry.mutation
    def logout(self, info) -> BaseSuccess:
        logout(info.context)
        return BaseSuccess(success=True)

    @strawberry.mutation
    def register(self, info, input: RegisterInput) -> Optional[ValidationErrorType]:
        User = get_user_model()
        
        if User.objects.filter(username=input.username).exists():
            return ValidationErrorType(
                field="username",
                message="Username already exists"
            )
            
        if User.objects.filter(email=input.email).exists():
            return ValidationErrorType(
                field="email",
                message="Email already exists"
            )
            
        user = User.objects.create_user(
            username=input.username,
            email=input.email,
            password=input.password,
            first_name=input.first_name or "",
            last_name=input.last_name or ""
        )
        
        login(info.context, user)
        return None