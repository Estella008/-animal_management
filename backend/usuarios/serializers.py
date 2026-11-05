from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Usuario


class CadastroSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(
        write_only=True,
        source="password",
        validators=[validate_password],
    )

    class Meta:
        model = Usuario
        fields = ["nome", "email", "senha"]

    def validate_email(self, value):
        email =value.strip().lower()
        if Usuario.objects.exclude(pk=self.instance.pk).filter(email=email).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return email

    def create(self, validated_data):
        senha = validated_data.pop("password")

        return Usuario.objects.create_user(
            password=senha,
            **validated_data,
        )
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "nome", "email"]