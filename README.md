# 🐾 HelPet

Aplicativo mobile de **gestão de saúde e cuidados para pets**, pensado para tutores que têm **vários animais**. Com o HelPet, o tutor cadastra seus pets e acompanha em um só lugar as vacinas, vermífugos e consultas veterinárias de cada um.

> Projeto desenvolvido por um grupo de estudantes, com potencial para se tornar Trabalho de Conclusão de Curso (TCC).

---

## 📋 Funcionalidades (MVP)

O foco inicial é em **cães e gatos**.

- **Cadastro e login de tutor** — autenticação com JWT
- **Perfil do usuário** — visualizar e editar a conta
- **Cadastro de pets** — nome, espécie, raça, data de nascimento, sexo, porte, peso, castração, foto e observações
- **Detalhes do pet** — tela individual de cada animal
- **Agenda de cuidados** (preenchimento manual):
  - Vacinas aplicadas, com controle de dose, reforço e data da próxima dose
  - Eventos como consultas e vermífugos, com status, horário, local e lembrete

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Mobile | React Native + Expo (Expo Router), TypeScript |
| Backend | Python, Django + Django REST Framework |
| Autenticação | Simple JWT |
| Banco de dados | PostgreSQL |

## 📁 Estrutura do repositório

```
.
├── backend/              # API em Django
│   ├── config/           # Configurações do projeto (settings, urls)
│   ├── usuarios/         # Cadastro, login e dados do tutor
│   ├── animais/          # Cadastro e consulta dos pets
│   ├── agenda/           # Vacinas e eventos (consultas, vermífugos...)
│   ├── opcoes/           # Listas de opções (ex.: raças, laboratórios)
│   ├── media/            # Fotos enviadas dos pets
│   └── requirements.txt
└── mobile/               # App em React Native (Expo)
    └── src/
        ├── app/          # Rotas/telas (Expo Router)
        ├── screens/      # Conteúdo das telas
        ├── components/   # Componentes reutilizáveis
        ├── services/     # Comunicação com a API
        ├── context/      # Contexto de autenticação
        └── utils/        # Funções auxiliares
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Python 3](https://www.python.org/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Node.js](https://nodejs.org/) (versão LTS)
- App **Expo Go** no celular, ou um emulador Android/iOS

### 1. Clonar o repositório

```bash
git clone https://github.com/Estella008/helpet.git
cd helpet
```

### 2. Backend (Django)

**a) Criar o banco de dados** no PostgreSQL com o nome que será usado no `.env` (ex.: `animal_management`).

**b) Criar e ativar o ambiente virtual**

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate
```

**c) Instalar as dependências**

```bash
pip install -r requirements.txt
```

**d) Criar o arquivo `backend/.env`** (use o `.env.example` como modelo):

```env
SECRET_KEY=sua_chave_secreta
DEBUG=True

DB_NAME=animal_management
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=127.0.0.1
DB_PORT=5432

ALLOWED_HOSTS=localhost,127.0.0.1
```

**e) Aplicar as migrações e iniciar o servidor**

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

> 💡 O `0.0.0.0` deixa a API acessível para o celular na mesma rede Wi-Fi. As migrações também já cadastram as opções padrão (como laboratórios).

Opcional — criar um usuário para acessar o painel admin em `http://localhost:8000/admin/`:

```bash
python manage.py createsuperuser
```

### 3. Mobile (Expo)

Em outro terminal:

```bash
cd mobile
npm install
```

**Criar o arquivo `mobile/.env`** apontando para o IP do computador onde o backend está rodando:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:8000/api
```

> 💡 Para descobrir o seu IP: `ipconfig` (Windows) ou `ifconfig` / `ip a` (Linux/macOS).
> Se não criar o `.env`, o app usa `http://10.0.2.2:8000/api` no emulador Android e `http://localhost:8000/api` no iOS/web.

**Iniciar o app**

```bash
npx expo start
```

Depois é só escanear o QR Code com o Expo Go, ou apertar `a` (Android) / `i` (iOS) para abrir no emulador.

---

## 🔌 Endpoints da API

Todos começam com `/api/`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/usuarios/cadastro/` | Cadastrar tutor |
| POST | `/usuarios/login/` | Login (retorna tokens JWT) |
| POST | `/usuarios/token/refresh/` | Renovar o token de acesso |
| GET | `/usuarios/me/` | Dados do usuário logado |
| GET | `/animais/` | Listar pets do tutor |
| POST | `/animais/cadastrar/` | Cadastrar pet |
| GET | `/animais/<id>/` | Detalhes de um pet |
| GET / POST | `/agenda/vacinas/` | Listar / cadastrar vacinas |
| GET / POST | `/agenda/eventos/` | Listar / cadastrar eventos |
| GET / POST | `/opcoes/` | Listar / cadastrar opções |

## 🗺️ Próximos passos (roadmap)

- [ ] Suporte a outras espécies além de cães e gatos
- [ ] Machine learning (scikit-learn) para sugerir intervalos ideais de vacinação
- [ ] Chatbot de suporte ao tutor

## 👩‍💻 Equipe

<!-- Adicionem aqui os nomes e links (GitHub/LinkedIn) de cada integrante -->

- Nome — [GitHub](https://github.com/)
- Nome — [GitHub](https://github.com/)
