from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import AnimalSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_animal(request):
    serializer = AnimalSerializer(data=request.data)

    if serializer.is_valid():
        animal = serializer.save(tutor=request.user)
        return Response(
            AnimalSerializer(animal).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )