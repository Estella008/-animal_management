from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Opcao
from .serializers import OpcaoSerializer


class OpcaoListCreateView(generics.ListCreateAPIView):
    """
    GET  /opcoes/?tipo=raca&especie=cachorro  -> lista padrão do app + itens da tutora
    POST /opcoes/  {"tipo": "raca", "especie": "cachorro", "nome": "Pug"}  -> adiciona item
    """

    serializer_class = OpcaoSerializer
    permission_classes = [IsAuthenticated]  # protegido pelo JWT, como as outras views

    def get_queryset(self):
        tipo = self.request.query_params.get("tipo")
        especie = self.request.query_params.get("especie")

        
        opcoes = Opcao.objects.filter(Q(tutor__isnull=True) | Q(tutor=self.request.user))

        if tipo:
            opcoes = opcoes.filter(tipo=tipo)
        if especie:
          
            opcoes = opcoes.filter(Q(especie=especie) | Q(especie=""))

        return opcoes

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dados = serializer.validated_data

        # Se o item já existe (padrão ou da própria tutora), devolve o existente
        # em vez de criar repetido. "pug" e "Pug" contam como iguais (iexact).
        existente = (
            Opcao.objects.filter(
                Q(tutor__isnull=True) | Q(tutor=request.user),
                tipo=dados["tipo"],
                especie=dados.get("especie", ""),
                nome__iexact=dados["nome"],
            ).first()
        )
        if existente:
            return Response(self.get_serializer(existente).data, status=status.HTTP_200_OK)

        opcao = serializer.save(tutor=request.user)
        return Response(self.get_serializer(opcao).data, status=status.HTTP_201_CREATED)
