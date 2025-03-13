from graphene_django import DjangoObjectType
from posts.models import UserProfile
from graphene import relay

class ProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'bio', 'avatar', 'date_of_birth', 'location', 'created_at', 'updated_at')
        interfaces = (relay.Node,) 



class ProfileConnection(relay.Connection):
    class Meta:
        node = ProfileType