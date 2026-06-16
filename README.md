# Clínica Web 

Sistema de **Clínica Web**
(projeto → configuração → pipeline → execução → deploy → infraestrutura → publicação).

O Clínica Web é um sistema de gerenciamento para clínicas de saúde. Ele centraliza o cadastro de profissionais de saúde (psicólogos, fisioterapeutas e médicos), o registro de atendimentos realizados por esses profissionais e os exames de laboratório ligados a cada atendimento.
Na prática, permite inserir, consultar (por nome, id ou categoria), alterar e excluir profissionais, além de agendar/registrar atendimentos, com data, horário, queixa e receita/recomendação, e anexar exames com seus resultados.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 17 + Spring Boot 3.2 |
| Frontend | React 18 + React Router |
| Banco de Dados | PostgreSQL 15 |
| Build Backend | Maven |
| Build Frontend | Node.js 20 + npm |
| Versionamento | Git + GitHub |
| CI/CD | GitHub Actions |
| Containers | Docker + Docker Compose |
| Produção | Render (Blueprint `render.yaml`) |

## Modelo de Domínio (do diagrama)

```
ProfissionalSaude (1) ──< Atendimento (N) ──< ExameLab (N)

ProfissionalSaude: id, nome, telefone, endereco, categoria [1..3]
    categoria -> 1 = Psicólogo | 2 = Fisioterapeuta | 3 = Médico
    Operações: Inserir, Alterar(id), Consultar(nome),
               Consultar(id), Consultar(categoria), Excluir(id)

Atendimento:      id, data, horario, problema, receita, profissional
    receita -> remédio (médico) / atividade física (fisioterapeuta)
               / atividades mentais (psicólogo)

ExameLab:         id, descricao, resultado, data, atendimento
```

## Estrutura do Projeto

```
clinica-web/
├── backend/                      # API REST (Java/Spring Boot)
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/clinica/
│       ├── model/                # ProfissionalSaude, Atendimento, ExameLab
│       ├── repository/           # *Repository (JPA)
│       └── controller/           # *Controller (CRUD REST)
├── frontend/                     # UI (React)
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── services/api.js
│       └── components/           # Listas e formulários das 3 entidades
├── docker-compose.yml
├── render.yaml                   # Infraestrutura como Código (Render)
├── .github/workflows/ci-cd.yml   # Pipeline CI/CD
```

## Como Executar (Desenvolvimento)

```bash
# Usando Docker Compose (backend + frontend + Postgres)
docker compose up -d

# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080/api/profissionais
# Swagger:   http://localhost:8080/swagger-ui.html
```

## Como Executar Testes

```bash
# Backend (JUnit 5 + Mockito + Spring Boot Test)
cd backend
mvn test

# Frontend (Jest / react-scripts)
cd frontend
npm install
npm test
```

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/profissionais` | Listar (Consultar) |
| GET | `/api/profissionais/{id}` | Consultar por id |
| GET | `/api/profissionais/buscar?nome=...` | Consultar por nome |
| GET | `/api/profissionais/categoria/{1\|2\|3}` | Consultar por categoria |
| POST | `/api/profissionais` | Inserir |
| PUT | `/api/profissionais/{id}` | Alterar |
| DELETE | `/api/profissionais/{id}` | Excluir |
| ... | `/api/atendimentos` , `/api/exames` | mesmos verbos CRUD |

