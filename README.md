# Fullstack Kanban App

Sistema completo de gerenciamento de tarefas estilo **Kanban**, com backend em **NestJS** e frontend em **React + Vite**. Utiliza **PostgreSQL via Docker Compose** e boas práticas com tipagem forte e organização modular.

---

## Tecnologias Utilizadas

### Frontend (`/web`)
- React + Vite
- TypeScript
- Material UI (MUI)
- Zustand
- React Hook Form + Zod
- Axios + React Query (TanStack)

### Backend (`/server`)
- NestJS
- TypeORM
- PostgreSQL
- Docker + Docker Compose

---

## Estrutura de Pastas
kanban-app/
├── server/ # Backend NestJS
└── web/ # Frontend React
---
Criação automática do banco de dados:
Ao iniciar o backend (npm run start:dev), o TypeORM criará automaticamente todas as tabelas necessárias no banco, com base nas entidades (synchronize: true habilitado).

Ou seja, não é necessário rodar migrations para testar o projeto.

Em produção:
Você não deve usar synchronize: true, mas sim migrations.

Inicie o Backend: 

cd server
npm install
npm run start:dev
server/.env

---

Inicie o Frontend:

cd ../web
npm install
npm run dev

Subindo o Banco de Dados com Docker(opcional)

Certifique-se de ter o Docker e o Docker Compose instalados.  
Depois, rode o seguinte comando na raiz do projeto:

```bash
docker-compose up -d