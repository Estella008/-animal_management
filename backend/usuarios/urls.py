
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import CadastroView, UsuarioLogadoView


urlpatterns = [
    path("cadastro/", CadastroView.as_view(), name="cadastro"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("me/", UsuarioLogadoView.as_view(), name="usuario_logado"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
