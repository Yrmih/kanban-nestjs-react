# Desafio Fullstack - Quadro Kanban

> Aplicação fullstack com NestJS + PostgreSQL no backend e ReactJS + Vite no frontend. Desenvolvido como parte de um desafio técnico para avaliação de habilidades de desenvolvimento web completo.

---

## Sobre o Projeto

Este projeto é um quadro Kanban com funcionalidades completas de CRUD, permitindo que usuários:

- Criem tarefas  
- Atualizem descrições e status  
- Arrastem tarefas entre colunas (drag and drop)  
- Removam tarefas  

---

## Tecnologias Utilizadas

### Backend

- NestJS  
- TypeORM  
- PostgreSQL (utilizando Railway)  
- TypeScript  

### Frontend

- ReactJS  
- Vite  
- TypeScript  
- Material UI (MUI)  
- react-beautiful-dnd (para drag and drop)  

---

## Estrutura do Projeto

```bash
.
├── server/         # Backend (NestJS)
├── web/            # Frontend (React + Vite)
└── README.md
```

---

## Funcionalidades Implementadas

- Listagem de tarefas  
- Criação de tarefas com título e descrição  
- Edição e exclusão de tarefas  
- Alteração de status: `pending`, `in_progress`, `testing`, `done`  
- Interface responsiva e intuitiva  
- Organização por colunas no estilo Kanban  
- Arrastar e soltar tarefas entre colunas  

---

## Requisitos Técnicos Atendidos

- NestJS com PostgreSQL  
- Integração com Railway usando TypeORM  
- Organização modular no backend  
- ReactJS com Vite e TypeScript no frontend  
- Componentização e boas práticas  
- Código limpo, organizado e versionado com git  

---

## Comandos Úteis

| Comando            | Descrição                            |
|--------------------|----------------------------------------|
| `npm run dev`       | Inicia o frontend em modo desenvolvimento |
| `npm run start:dev` | Inicia o backend em modo desenvolvimento  |

---

## Considerações Finais

Este desafio foi desenvolvido com foco em boas práticas, organização e entrega eficiente.  
Sinta-se à vontade para clonar, testar e sugerir melhorias.
