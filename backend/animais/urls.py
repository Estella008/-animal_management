from django.urls import path
from . import views

urlpatterns = [
    path('cadastrar/', views.CadastrarAnimalView.as_view(), name='cadastrar_animal'),
    path('', views.ListarAnimaisView.as_view(), name='listar_animais'),
    path('<int:pk>/', views.DetalhesAnimalView.as_view(), name='detalhes_animal'),
]
