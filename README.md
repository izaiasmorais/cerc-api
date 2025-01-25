# API de gerenciamento de convites

## Introdução

Uma solução eficiente para controlar e gerenciar convites de acesso a apartamentos, garantindo segurança e praticidade para moradores e visitantes.

## Tecnologias

- Linguagem: [Node.js](https://nodejs.org)
- Framework: [Fastify.js](https://www.fastify.io)
- Banco de Dados: [PostgreSQL](https://www.postgresql.org)
- ORM: [PrismaORM](https://www.prisma.io)
- Gerenciamento de Dependências: [pnpm](https://pnpm.io)

## Endpoints

| Método   | Endpoint                         | Descrição                                             |
| -------- | -------------------------------- | ----------------------------------------------------- |
| **POST** | `/invites`                       | Cria um novo convite                                  |
| **GET**  | `/invites`                       | Lista todos os convites de uma unidade                |
| **GET**  | `/invites/validate/{inviteCode}` | Valida se um convite existe e se está expirado ou não |

## Instalação

Clone o repositório:

```bash
git clone https://github.com/izaiasmorais/cerc-api
cd cerc-api
```

Instale as dependências:

```bash
pnpm install
```

Configure o arquivo .env com suas credenciais:

```env
DATABASE_URL=""
PORT=""
JWT_SECRET=""
```

Gere o cliente do prisma:

```bash
pnpm prisma generate
```

## Executando o Projeto

Inicie o servidor:

```bash
pnpm dev
```
