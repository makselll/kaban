import graphene
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from ..queries.profile import ProfileType


class RegisterMutation(graphene.Mutation):
    profile = graphene.Field(ProfileType)

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        password2 = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, username, email, password, password2):
        if password != password2:
            raise ValidationError("Passwords don't match")
        
        try:
            validate_password(password)
        except ValidationError as e:
            raise ValidationError(e.messages)
        
        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already exists")
        
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already exists")
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        login(info.context, user)
        return RegisterMutation(profile=info.context.user.profile)


class LoginMutation(graphene.Mutation):
    profile = graphene.Field(ProfileType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def resolve_login(self, info, username, password):
        return User.objects.exists(username=username)
    
    @classmethod
    def mutate(cls, root, info, username, password):
        form = AuthenticationForm(info.context, data={"username": username, "password": password})
        if form.is_valid():
            login(info.context, form.get_user())
            return LoginMutation(profile=info.context.user.profile)
        return False


class LogoutMutation(graphene.Mutation):
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info):
        logout(info.context)
        return LogoutMutation(success=True)