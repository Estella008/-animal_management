
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from .models import Evento, VacinaAplicada
from .serializers import EventoSerializer, VacinaAplicadaSerializer


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
class EventoListCreateView(generics.ListCreateAPIView):


    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Começa só com os eventos dos animais da tutora logada
        eventos = Evento.objects.filter(animal__tutor=self.request.user)

        animal_id = self.request.query_params.get("animal")
        if animal_id:
            if not animal_id.isdigit() or int(animal_id) <= 0:
                raise ValidationError({"animal": "Informe um ID de animal válido."})
            eventos = eventos.filter(animal_id=int(animal_id))

        status = self.request.query_params.get("status")
        if status:
            status_validos = [valor for valor, _ in Evento.STATUS]
            if status not in status_validos:
                raise ValidationError(
                    {"status": f"Use um destes: {', '.join(status_validos)}."}
                )
            eventos = eventos.filter(status=status)

        return eventos

