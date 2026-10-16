from rest_framework import serializers
from .models import Animal


class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = [
            'id',
            'nome',
            'especie',
            'data_nascimento',
            'sexo',
            'castrado',
            'porte',
            'peso',
            'observacoes',
        ]
