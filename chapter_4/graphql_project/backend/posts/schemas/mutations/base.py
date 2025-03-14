from django import forms

from collections import OrderedDict

import graphene
from graphene import Field, InputField

from graphene.types.utils import yank_fields_from_attrs
from graphene_django.registry import get_global_registry


from graphene_django.forms.mutation import DjangoModelDjangoFormMutationOptions
from graphene_django.forms.converter import convert_form_field
from graphene_file_upload.scalars import Upload
from graphene_django.forms.mutation import BaseDjangoFormMutation
from graphene_django.forms.types import ErrorType
from graphene_django.constants import MUTATION_ERRORS_FLAG


def fields_for_form(form, only_fields, exclude_fields):
    fields = OrderedDict()
    for name, field in form.fields.items():
        is_not_in_only = only_fields and name not in only_fields
        is_excluded = (
            name in exclude_fields  # or
            # name in already_created_fields
        )

        if is_not_in_only or is_excluded:
            continue
        if isinstance(field, forms.FileField):
            fields[name] = Upload()
        else:
            fields[name] = convert_form_field(field)
    return fields


class BlogModelFormMutation(BaseDjangoFormMutation):
    class Meta:
        abstract = True

    errors = graphene.List(graphene.NonNull(ErrorType), required=True)



    @classmethod
    def __init_subclass_with_meta__(
        cls,
        form_class=None,
        model=None,
        return_field_name=None,
        only_fields=(),
        exclude_fields=(),
        **options,
    ):
        if not form_class:
            raise Exception("form_class is required for DjangoModelFormMutation")

        if not model:
            model = form_class._meta.model

        if not model:
            raise Exception("model is required for DjangoModelFormMutation")

        form = form_class()
        input_fields = fields_for_form(form, only_fields, exclude_fields)
        if "id" not in exclude_fields:
            input_fields["id"] = graphene.ID()

        registry = get_global_registry()
        model_type = registry.get_type_for_model(model)
        if not model_type:
            raise Exception(f"No type registered for model: {model.__name__}")

        if not return_field_name:
            model_name = model.__name__
            return_field_name = model_name[:1].lower() + model_name[1:]

        output_fields = OrderedDict()
        output_fields[return_field_name] = graphene.Field(model_type)

        _meta = DjangoModelDjangoFormMutationOptions(cls)
        _meta.form_class = form_class
        _meta.model = model
        _meta.return_field_name = return_field_name
        _meta.fields = yank_fields_from_attrs(output_fields, _as=Field)

        input_fields = yank_fields_from_attrs(input_fields, _as=InputField)
        super().__init_subclass_with_meta__(
            _meta=_meta, input_fields=input_fields, **options
        )

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        form = cls.get_form(root, info, **input)

        if form.is_valid():
            return cls.perform_mutate(form, info)
        else:
            errors = ErrorType.from_errors(form.errors)
            _set_errors_flag_to_context(info)

            return cls(errors=errors)

    @classmethod
    def perform_mutate(cls, form, info):
        obj = form.save()
        kwargs = {cls._meta.return_field_name: obj}
        return cls(errors=[], **kwargs)


def _set_errors_flag_to_context(info):
    # This is not ideal but necessary to keep the response errors empty
    if info and info.context:
        setattr(info.context, MUTATION_ERRORS_FLAG, True)