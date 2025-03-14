import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from graphene_subscriptions.consumers import GraphqlSubscriptionConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        path("ws/comments", GraphqlSubscriptionConsumer),
    ])
}) 