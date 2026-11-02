from rest_framework import serializers

from .models import Opcao


class OpcaoSerializer(serializers.ModelSerializer):
   
    personalizada = serializers.SerializerMethodField()

    class Meta:
        model = Opcao
        fields = ["id", "tipo", "especie", "nome", "personalizada"]

    def get_personalizada(self, obj):
        return obj.tutor_id is not None

    def validate_nome(self, valor):
        valor = " ".join(valor.split())  # tira espaços extras: "  Shih   Tzu " -> "Shih Tzu"
        if not valor:
            raise serializers.ValidationError("Informe um nome.")
        return valor