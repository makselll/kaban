import strawberry


@strawberry.type
class ValidationErrorType:
    field: str
    message: str

@strawberry.type
class BaseSuccess:
    success: bool = True
