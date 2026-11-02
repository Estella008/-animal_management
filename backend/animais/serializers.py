# backend/animais/serializers.py
from rest_framework import serializers
from .models import Animal


class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = [
            "id", "tutor", "nome", "especie", "raca", "data_nascimento",
            "sexo", "castrado", "porte", "peso", "foto", "observacoes",
        ]
        read_only_fields = ["id", "tutor"]  # o app não manda; o Django preenche