import graphene
from queries.comment import CommentType
from graphene_subscriptions.events import UPDATED, CREATED
from posts.models import Comment

class Subscription(graphene.ObjectType):
    your_model_created = graphene.Field(CommentType)
    your_model_updated = graphene.Field(CommentType)

    def resolve_your_model_created(root, info):
        return root.filter(
            lambda event:
                event.operation == CREATED and
                isinstance(event.instance, Comment)
        ).map(lambda event: event.instance)
    
    def resolve_your_model_updated(root, info, id):
        return root.filter(
            lambda event:
                event.operation == UPDATED and
                isinstance(event.instance, Comment) and
                event.instance.pk == int(id)
        ).map(lambda event: event.instance)