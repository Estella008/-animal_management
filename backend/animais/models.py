# backend/animais/models.py
from django.conf import settings
from django.db import models


class Animal(models.Model):
    ESPECIES = [("cachorro", "Cachorro"), ("gato", "Gato")]
    SEXOS = [("macho", "Macho"), ("femea", "Fêmea")]
    PORTES = [("pequeno", "Pequeno"), ("medio", "Médio"), ("grande", "Grande")]

    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="animais",
    )
    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=20, choices=ESPECIES)
    raca = models.CharField(max_length=100, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    sexo = models.CharField(max_length=10, choices=SEXOS)
    castrado = models.BooleanField(default=False)
    porte = models.CharField(max_length=10, choices=PORTES)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    foto = models.ImageField(upload_to="animais/", null=True, blank=True)
    observacoes = models.TextField(blank=True)

    def __str__(self):
        return self.nome