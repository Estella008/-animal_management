from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from .models import Animal
from .serializers import AnimalSerializer


class CadastrarAnimalView(generics.CreateAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]          # só entra quem está logado
    parser_classes = [MultiPartParser, FormParser]  # permite receber a foto

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)    # pet ligado a quem está logada


class ListarAnimaisView(generics.ListAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Animal.objects.filter(tutor=self.request.user)  # só os pets dela

class DetalhesAnimalView(generics.RetrieveUpdateAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Animal.objects.filter(tutor=self.request.user)