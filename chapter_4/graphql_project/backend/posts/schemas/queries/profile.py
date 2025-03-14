from graphene_django import DjangoObjectType
from posts.models import UserProfile
from graphene import relay, Field
from django.contrib.auth.models import User

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        interfaces = (relay.Node,) 


class ProfileType(DjangoObjectType):
    user = Field(UserType)
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'bio', 'avatar', 'date_of_birth', 'location', 'created_at', 'updated_at')
        interfaces = (relay.Node,) 



class ProfileConnection(relay.Connection):
    class Meta:
        node = ProfileType