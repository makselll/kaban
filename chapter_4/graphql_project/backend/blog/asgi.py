import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path, re_path
from strawberry.channels import GraphQLWSConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog.settings')

django_asgi_app = get_asgi_application()

# Define URL patterns for GraphQL WebSocket
url_pattern = r"graphql/"
from posts.schemas.schema import schema

# Create the ASGI application
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": URLRouter(
            [
                re_path(url_pattern, GraphQLWSConsumer.as_asgi(schema=schema)),
            ]
        ),
    }
)