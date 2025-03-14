import json
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import AsyncGraphQLView
from strawberry.django.context import StrawberryDjangoContext
from posts.schemas.schema import schema
from django.contrib.auth import get_user
from asgiref.sync import sync_to_async


class MyGraphQLView(AsyncGraphQLView):
    async def get_context(self, request, response) :
        request.user = await sync_to_async(get_user)(request)
        return StrawberryDjangoContext(request=request, response=response)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(MyGraphQLView.as_view(schema=schema, multipart_uploads_enabled=True))),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 