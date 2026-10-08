from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    data_nascimento = models.DateField(null=True, blank=True)
    quantidade_pets = models.PositiveIntegerField(default=1)