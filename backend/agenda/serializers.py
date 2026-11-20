
from rest_framework import serializers

from .models import Evento, VacinaAplicada


class VacinaAplicadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacinaAplicada
        fields = [
            "id",
            "animal",
            "nome"
            "laboratorio",
            "data_aplicacao",
            "frequencia",
            "numero_dose",
            "total_doses",
            "intervalo_doses_dias",
            "intervalo_reforco_meses",
            "proxima_dose",
            "observacoes",
        ]
        read_only_fields = ["id"]

    def validate_animal(self, animal):
        if animal.tutor_id != self.context["request"].user.id:
            raise serializers.ValidationError(
                "Você não pode cadastrar vacinas para este animal."
            )
        return animal
    
class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = [
            "id",
            "animal",
            "tipo",
            "status",
            "titulo",
            "data",
            "hora",
            "local",
            "profissional",
            "observacoes",
            "lembrete_dias_antes",
            "criado_em",
        ]
        read_only_fields = ["id", "criado_em"]

    def validate_animal(self, animal):
        # Só a tutora dona do animal pode cadastrar eventos para ele
        if animal.tutor_id != self.context["request"].user.id:
            raise serializers.ValidationError(
                "Você não pode cadastrar eventos para este animal."
            )
        return animal

