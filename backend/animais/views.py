from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from .serializers import AnimalSerializer
from .models import Animal


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([JSONParser, FormParser, MultiPartParser])
def cadastrar_animal(request):

    if not settings.DEBUG:
        return Response(
            {'erro': 'Cadastro de teste desabilitado.'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = AnimalSerializer(data=request.data)

    if serializer.is_valid():
        Usuario = get_user_model()

        tutor, criado = Usuario.objects.get_or_create(
            username='tutor_teste'
        )

        animal = serializer.save(tutor=tutor)

        return Response(
            AnimalSerializer(animal).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([AllowAny])
def listar_animais(request):
    if not settings.DEBUG:
        return Response(
            {'erro': 'Listagem de teste desabilitada.'},
            status=status.HTTP_403_FORBIDDEN
        )

    animais = Animal.objects.filter(
        tutor__username='tutor_teste'
    ).order_by('-id')

    serializer = AnimalSerializer(
        animais,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)