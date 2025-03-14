import graphene
from graphene_file_upload.scalars import Upload
from .queries import Query
from .mutations import Mutation
from django import forms
from graphene_django.forms.converter import convert_form_field

@convert_form_field.register(forms.Field)
def convert_form_field_to_upload(field):
    return Upload(
        description="Upload a file", required=field.required
    )


schema = graphene.Schema(query=Query, mutation=Mutation, types=[Upload]) 