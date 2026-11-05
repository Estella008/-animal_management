
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from .models import VacinaAplicada
from .serializers import VacinaAplicadaSerializer


class VacinaListCreateView(generics.ListCreateAPIView):
    serializer_class = VacinaAplicadaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vacinas = VacinaAplicada.objects.filter(
            animal__tutor=self.request.user
        )

        animal_id = self.request.query_params.get("animal")

        if animal_id:
            if not animal_id.isdigit() or int(animal_id) <= 0:
                raise ValidationError(
                    {"animal": "Informe um ID de animal válido."}
                )

            vacinas = vacinas.filter(animal_id=int(animal_id))

        return vacinas
