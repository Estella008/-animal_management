from django.urls import path

from .views import OpcaoListCreateView

urlpatterns = [
    path("", OpcaoListCreateView.as_view()),
]