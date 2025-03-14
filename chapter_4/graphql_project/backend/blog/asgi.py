import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from strawberry_django.routers import AuthGraphQLProtocolTypeRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog.settings')

django_asgi_app = get_asgi_application()


from posts.schemas.schema import schema 
application = AuthGraphQLProtocolTypeRouter(
    schema,
    django_application=django_asgi_app,
)