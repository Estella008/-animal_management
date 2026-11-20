from django.urls import path
from . import views

urlpatterns = [
    path(
        "vacinas/",
        views.VacinaListCreateView.as_view(),
        name="listar_cadastrar_vacinas",
    ),
      path(
        "eventos/",
        views.EventoListCreateView.as_view(),
        name="listar_cadastrar_eventos",
    ),
]