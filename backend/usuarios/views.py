
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import CadastroSerializer, UsuarioSerializer




class CadastroView(generics.CreateAPIView):
    serializer_class = CadastroSerializer
    permission_classes = [AllowAny]

class UsuarioLogadoView(generics.RetrieveUpdateAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user