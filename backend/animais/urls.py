from django.urls import path
from . import views

urlpatterns = [
    path('cadastrar/', views.cadastrar_animal, name='cadastrar_animal'),
]
