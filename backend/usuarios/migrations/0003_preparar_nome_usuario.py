from django.db import migrations, models

def preencher_nome(apps, schema_editor):
    Usuario = apps.get_model("usuarios", "Usuario")

    Usuario.objects.filter(nome__isnull=True).update(nome="")
    Usuario.objects.filter(nome="").update(nome="Tutor de teste")

    Usuario.objects.filter(email="").update(
        email="tutor.teste@example.com"
    )


class Migration(migrations.Migration):

    dependencies = [
        ("usuarios", "0002_usuario_data_nascimento_usuario_quantidade_pets"),
    ]

    operations = [
        migrations.AddField(
            model_name="usuario",
            name="nome",
            field=models.CharField(
                max_length=150,
                null=True,
                blank=True,
            ),
        ),
        migrations.RunPython(
            preencher_nome,
            migrations.RunPython.noop,
        ),
    ]