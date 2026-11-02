from django.contrib import admin

from .models import Opcao


@admin.register(Opcao)
class OpcaoAdmin(admin.ModelAdmin):
    list_display = ["nome", "tipo", "especie", "tutor"]
    list_filter = ["tipo", "especie"]
    search_fields = ["nome"]