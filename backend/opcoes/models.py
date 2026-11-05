from django.conf import settings
from django.db import models


class Opcao(models.Model):
    """
    Itens das listas de escolha do app (raças, vacinas...).

    - tutor vazio (null): item padrão do app, aparece para todo mundo.
    - tutor preenchido: item que aquela tutora adicionou; só ela vê.
    - especie vazia (""): item vale para todas as espécies.
    """

    TIPOS = [
        ("raca", "Raça"),
        ("vacina", "Vacina"),
        ("laboratorio", "Laboratório"),
    ]
    ESPECIES = [("cachorro", "Cachorro"), ("gato", "Gato")]

    tipo = models.CharField(max_length=20, choices=TIPOS)
    especie = models.CharField(max_length=20, choices=ESPECIES, blank=True)
    nome = models.CharField(max_length=100)
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="opcoes",
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["nome"]
        verbose_name = "opção"
        verbose_name_plural = "opções"

    def __str__(self):
        return f"{self.get_tipo_display()}: {self.nome}"
