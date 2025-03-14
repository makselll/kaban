import strawberry
from strawberry.file_uploads import Upload
from .queries import Query
from .mutations import Mutation
from .subscription.comments import Subscription

from strawberry_django.optimizer import DjangoOptimizerExtension
from starlette.datastructures import UploadFile

schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription, extensions=[
        DjangoOptimizerExtension,
    ],
    scalar_overrides={UploadFile: Upload}
    )
