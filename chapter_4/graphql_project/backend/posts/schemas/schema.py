import graphene
from graphene_file_upload.scalars import Upload
from .queries import Query
from .mutations import Mutation
from .subscription.base import Subscription

schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription, types=[Upload]) 