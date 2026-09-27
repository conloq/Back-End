# Back-End — Mash API REST

API REST do Mash (migração do app monolítico [`conloq/mash`](https://github.com/conloq/mash)) — Express 5 + Sequelize + MySQL.

## Stack

- Node.js (ESM), Express 5, Sequelize, MySQL (database `mash`)
- JWT Bearer + Argon2id (memoryCost 2^16, timeCost 3, parallelism 1)
- Multer (memoryStorage) → Cloudinary
- Swagger: `GET /api-docs`

## Como rodar

```bash
npm install
npm start        # porta 8080
```

## Variáveis de ambiente (`.env` — NUNCA commitar valores reais)

```
DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE,
JWT_SECRET_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_KEY_CLOUDINARY
```

## Padrão de resposta (decisão da equipe — base: aula-05 DW3)

**Sucesso:**
- Operação sem entidade: `{ "message": "<texto>" }` — ex.: `{ "message": "Receita criada com sucesso" }`
- Operação que devolve entidade: `{ "message": "<texto>", "<singular>": { ... } }`
- Detalhe: `{ "<singular>": { ... } }` — ex.: `{ "recipe": { ... } }`
- Listagem: `{ "<plural>": [ ... ] }` — ex.: `{ "recipes": [...] }`
- **Não usar wrapper genérico `data`.**

**Erro** (string direta em português, sem código interno):
- `400`: `{ "error": "<regra de validação>" }` — ex.: `{ "error": "Nome é obrigatório" }`
- `401`: `{ "error": "Token inválido ou expirado" }`
- `403`: `{ "error": "Acesso negado" }`
- `404`: `{ "error": "<Recurso> não encontrado" }` — também para leitura de recurso de outro usuário (não revelar existência)
- `409`: `{ "error": "Receita já existe" }`
- `500`: `{ "error": "Erro interno do servidor" }`

**DELETE:** `204` sem corpo — encerrar com `res.sendStatus(204)`

Regras de nomes: rotas e identificadores em inglês; coleção no plural (`/recipes`, `/lots`, `/analyses`), recurso único no singular (`/user`), `login` à parte; parâmetro de rota `:id`. Corpo e resposta JSON em camelCase — os nomes físicos das colunas (`user_id`, `nome`) nunca aparecem no contrato; a tradução é feita na borda (DTO).

A especificação dos endpoints do depósito do PI (03/11/2026) está nas issues de contrato de [`conloq/mash`](https://github.com/conloq/mash/issues/66) (roteiro #66 e issues do épico #30).

## Banco e Sequelize

- Runtime vigente: `Connection.sync()` no startup (`app.js`).
- A pasta `migrations/` existe (decisão da equipe, #66 de 26/09), mas os arquivos atuais **não estão prontos para uso** (não executar). Schema/migration é trabalho separado, com issue própria.
- ⚠️ Evitar: `define: { underscored: true }` global **não pode** ser ativado no schema existente (renomearia `createdAt`/`updatedAt` e FKs). Se `models` novos precisarem, usar opção local no model, com migration testada em banco vazio.

## Regras de contribuição

- **Nunca commitar direto na `main`** — branch própria + pull request + peer review (ver [#35](https://github.com/conloq/mash/issues/35)). Nota: o repo é privado e o plano free **não permite branch protection**; até o time decidir, a disciplina é manual e revisão é obrigatória.
- Conventional Commits em pt-BR: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Issues principais: [#30](https://github.com/conloq/mash/issues/30) (épico migração), [#32](https://github.com/conloq/mash/issues/32) (CRUD receitas), [#38](https://github.com/conloq/mash/issues/38) (auth/IDOR), [#41](https://github.com/conloq/mash/issues/41) (testes), [#60](https://github.com/conloq/mash/issues/60) (contrato de análise de iodo).

## Estrutura

```
├── controllers/     # finos: validam input, mapeiam erros para status HTTP
├── services/        # regras de negócio, exportados como singleton (export default new X())
├── middlewares/     # authMiddleware (JWT), multer
├── models/          # Sequelize via Connection; colunas snake_case, JSON camelCase (DTO na borda)
├── routes/          # routers por entidade
├── migrations/      # fora de uso até serem revisados (decisão 26/09)
└── config/          # sequelize, cloudinary, associations, swagger
```
