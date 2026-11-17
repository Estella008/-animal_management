
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

class Evento(models.Model):
    TIPOS = [
        ("consulta", "Consulta"),
        ("exame", "Exame"),
        ("banho_tosa", "Banho e tosa"),
        ("outro", "Outro"),
    ]
    STATUS = [
        ("agendado", "Agendado"),
        ("realizado", "Realizado"),
        ("cancelado", "Cancelado"),
    ]
    
    animal = models.ForeignKey(
        "animais.Animal",
        on_delete=models.CASCADE,
        related_name="eventos",
    )

    tipo = models.CharField(max_length=20, choices=TIPOS)
    status = models.CharField(max_length=20, choices=STATUS, default="agendado")

    # Ex.: "Retorno da displasia", "Hemograma", "Banho mensal"
    titulo = models.CharField(max_length=100)

    data = models.DateField()
    hora = models.TimeField(null=True, blank=True)  # opcional

    local = models.CharField(max_length=150, blank=True)
    # Quem atende: veterinário(a), tosador(a)...
    profissional = models.CharField(max_length=100, blank=True)
    observacoes = models.TextField(blank=True)

    # Quantos dias antes o app avisa a tutora (0 = no próprio dia)
    lembrete_dias_antes = models.PositiveSmallIntegerField(default=1)

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["data", "hora"]

    def __str__(self):
        return f"{self.get_tipo_display()}: {self.titulo} - {self.animal.nome} ({self.data})"
