from django.urls import path
from . import views

urlpatterns = [
    path(
        "vacinas/",
        views.VacinaListCreateView.as_view(),
        name="listar_cadastrar_vacinas",
    ),
]