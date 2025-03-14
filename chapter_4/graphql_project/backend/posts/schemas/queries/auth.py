import graphene
from django.contrib.auth import logout


class LogOutMutation(graphene.Mutation):
    @classmethod
    def mutate(cls, root, info, input):
        if info.context.user.is_authenticated:
            logout(info.context)
            return True
        return False