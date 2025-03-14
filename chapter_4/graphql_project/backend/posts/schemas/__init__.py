import graphene
from graphene_file_upload.scalars import Upload
from .queries import Query
from .mutations import Mutation


schema = graphene.Schema(query=Query, mutation=Mutation, types=[Upload]) 