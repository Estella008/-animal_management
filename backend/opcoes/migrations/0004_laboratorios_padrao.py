
from django.db import migrations


LABORATORIOS = [
    "Boehringer Ingelheim",
    "Ceva Saúde Animal",
    "MSD Saúde Animal",
    "Virbac",
    "Zoetis",
]


def criar_laboratorios(apps, schema_editor):
    Opcao = apps.get_model("opcoes", "Opcao")

    for nome in LABORATORIOS:
        existe = Opcao.objects.filter(
            tipo="laboratorio",
            especie="",
            tutor__isnull=True,
            nome__iexact=nome,
        ).exists()

        if not existe:
            Opcao.objects.create(
                tipo="laboratorio",
                especie="",
                nome=nome,
                tutor=None,
            )


class Migration(migrations.Migration):
    dependencies = [
        ("opcoes", "0003_alter_opcao_tipo"),
    ]

    operations = [
        migrations.RunPython(
            criar_laboratorios,
            migrations.RunPython.noop,
        ),
    ]
