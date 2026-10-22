from django.urls import path
from . import views

urlpatterns = [
    path('cadastrar/', views.cadastrar_animal, name='cadastrar_animal'),
    path('listar/', views.listar_animais, name='listar_animais'),
]
