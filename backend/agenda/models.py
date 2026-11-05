
from django.db import models


class VacinaAplicada(models.Model):
    FREQUENCIAS = [
        ("unica", "Dose única"),
        ("anual", "Anual"),
        ("serie_unica", "Várias doses, sem repetição"),
        ("serie_anual", "Várias doses, repetição anual"),
        ("personalizada", "Personalizada"),
    ]

    animal = models.ForeignKey(
        "animais.Animal",
        on_delete=models.CASCADE,
        related_name="vacinas",
    )

    nome = models.CharField(max_length=100)
    laboratorio = models.CharField(max_length=100, blank=True)
    data_aplicacao = models.DateField()

    frequencia = models.CharField(
        max_length=20,
        choices=FREQUENCIAS,
    )

    numero_dose = models.PositiveIntegerField(default=1)
    total_doses = models.PositiveIntegerField(null=True, blank=True)

    intervalo_doses_dias = models.PositiveIntegerField(
        null=True, blank=True
    )

    intervalo_reforco_meses = models.PositiveIntegerField(
        null=True, blank=True
    )

    proxima_dose = models.DateField(null=True, blank=True)
    observacoes = models.TextField(blank=True)

    class Meta:
        ordering = ["-data_aplicacao"]

    def __str__(self):
        return f"{self.nome} - {self.animal.nome}"
