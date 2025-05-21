# Fullstack Kanban App

Sistema completo de gerenciamento de tarefas estilo **Kanban**, com backend em **NestJS** e frontend em **React + Vite**. A aplicação utiliza **PostgreSQL** via **Docker Compose**, e traz uma stack moderna com foco em produtividade, tipagem forte e boas práticas.

---

## Stacks e Tecnologias

### Frontend (`/client`)
- **React** – v18.2+
- **Vite** – v5+
- **TypeScript** – v5.4+
- **Material UI (MUI)** – v5+
- **Zustand** – v4+
- **React Hook Form** – v7+
- **Zod** – v3+
- **Axios** – v1+
- **React Query (TanStack Query)** – v5+

### 🛠 Backend (`/server`)
- **NestJS** – v10+
- **TypeScript** – v5.4+
- **TypeORM** – v0.3+
- **PostgreSQL** – via Docker Compose
- **Docker & Docker Compose**

---

## Estrutura do Projeto

```bash
root
├── server        # Backend NestJS
└── web           # Frontend React + Vite

## Clonar o repositório

git clone https://github.com/seu-usuario/kanban-app.git
cd kanban-app

## Criar o arquivo .env dentro da pasta server
# .env (server/.env)

DATABASE_URL=postgres://<user-banco-exemplo:senha>@localhost:5432/<Seu_banco>
CLIENT_URL=http://localhost:5173
PORT=3000

⚠️ O projeto usa synchronize: true no TypeORM, o que cria automaticamente as tabelas com base nas entidades. Isso é ideal para desenvolvimento, mas NÃO deve ser usado em produção, pois pode apagar dados.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

🛠 Rodando o Backend

cd server
npm install
npm run start:dev

💻 Rodando o Frontend

cd web
npm install
npm run dev


#Nota para produção:

# synchronize: true

#Isso é ótimo para desenvolvimento e testes, mas não é usado em produção, porque:

#Se você mudar uma entidade sem querer, o TypeORM pode deletar ou recriar tabelas.

#Em produção, o ideal é usar migrations controladas, com typeorm migration:generate e run.

