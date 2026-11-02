"""
Migração de DADOS: preenche a tabela com a lista padrão de raças e vacinas.
Roda uma vez só, no `python manage.py migrate`, igual às migrações de estrutura.
Para incluir mais itens padrão depois, criem uma nova migração neste formato
(ou cadastrem pelo /admin).
"""

from django.db import migrations

RACAS = {
    "cachorro": [
        "SRD (Sem raça definida)",
        "Akita", "Basset Hound", "Beagle", "Bernese", "Bichon Frisé", "Border Collie",
        "Boston Terrier", "Boxer", "Buldogue Campeiro", "Buldogue Francês", "Buldogue Inglês",
        "Bull Terrier", "Cane Corso", "Cavalier King Charles Spaniel", "Chihuahua", "Chow Chow",
        "Cocker Spaniel", "Dachshund (Salsicha)", "Dálmata", "Dobermann", "Dogo Argentino",
        "Fila Brasileiro", "Golden Retriever", "Husky Siberiano", "Jack Russell Terrier",
        "Labrador Retriever", "Lhasa Apso", "Malamute do Alasca", "Maltês", "Pastor Alemão",
        "Pastor Australiano", "Pastor Belga", "Pequinês", "Pinscher", "Pit Bull", "Poodle",
        "Pug", "Rottweiler", "Samoieda", "São Bernardo", "Schnauzer", "Shar-Pei", "Shiba Inu",
        "Shih Tzu", "Spitz Alemão (Lulu da Pomerânia)", "Staffordshire Bull Terrier",
        "Terrier Brasileiro (Fox Paulistinha)", "Weimaraner", "West Highland White Terrier",
        "Whippet", "Yorkshire Terrier",
    ],
    "gato": [
        "SRD (Sem raça definida)",
        "Abissínio", "Angorá", "Azul Russo", "Bengal", "Birmanês (Sagrado da Birmânia)",
        "Bombaim", "British Shorthair", "Burmês", "Chartreux", "Cornish Rex", "Devon Rex",
        "Exótico", "Himalaio", "Maine Coon", "Manx", "Norueguês da Floresta", "Persa",
        "Ragdoll", "Savannah", "Scottish Fold", "Siamês", "Siberiano", "Sphynx",
    ],
}

VACINAS = {
    "cachorro": ["V8", "V10", "Gripe canina", "Giárdia", "Leishmaniose"],
    "gato": ["V3", "V4", "V5", "Leucemia felina (FeLV)"],
    "": ["Antirrábica"],  # vale para as duas espécies
}


def criar_padroes(apps, schema_editor):
    # Nas migrações, o model é pego assim (e não com import normal)
    Opcao = apps.get_model("opcoes", "Opcao")
    itens = []
    for especie, nomes in RACAS.items():
        itens += [Opcao(tipo="raca", especie=especie, nome=n) for n in nomes]
    for especie, nomes in VACINAS.items():
        itens += [Opcao(tipo="vacina", especie=especie, nome=n) for n in nomes]
    Opcao.objects.bulk_create(itens)


def remover_padroes(apps, schema_editor):
    # Permite desfazer a migração: apaga só os itens padrão
    Opcao = apps.get_model("opcoes", "Opcao")
    Opcao.objects.filter(tutor__isnull=True).delete()


class Migration(migrations.Migration):
    dependencies = [("opcoes", "0001_initial")]

    operations = [migrations.RunPython(criar_padroes, remover_padroes)]