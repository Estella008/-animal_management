
from rest_framework import serializers

from .models import VacinaAplicada


class VacinaAplicadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacinaAplicada
        fields = [
            "id",
            "animal",
            "nome",
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
