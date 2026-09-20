# Back-End — Mash API REST

API REST do Mash (migração do app monolítico [`conloq/mash`](https://github.com/conloq/mash)) — Express 5 + Sequelize + MySQL.

## Stack

- Node.js (ESM), Express 5, Sequelize, MySQL (database `mash`)
- JWT Bearer + Argon2id (memoryCost 2^16, timeCost 3, parallelism 1)
- Multer (memoryStorage) → Cloudinary
- Swagger: `GET /api-docs`

## Como rodar

```bash
cd Back-End/src
npm install
npm start        # porta 8080
```

## Variáveis de ambiente (`.env` — NUNCA commitar valores reais)

```
DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE,
JWT_SECRET_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_KEY_CLOUDINARY
```

## Padrão de resposta

Formato usado no código (ver controllers em `src/controllers/`):

**Sucesso:**
- `200/201`: `{ "message": "<texto>", ...dados }` — ex.: `{ "message": "Receita criada com sucesso", "recipe": { ... } }`
- Consulta: `{ "recipe": {...} }` — o objeto direto, sem wrapper

**Erro** (string direta em português, sem código interno):
- `400`: `{ "error": "Nome não pode estar vazio" }`
- `401`: `{ "error": "E-mail ou senha invalidos" }`
- `404`: `{ "error": "Id não existe" }`
- `500`: `{ "error": "Erro interno no servidor" }`

**DELETE:** `204` sem corpo

Regras: rotas e identificadores em inglês; texto das mensagens em pt-BR.

## Regras de contribuição

- **Nunca commitar direto na `main`** — branch própria + pull request + peer review (ver [#35](https://github.com/conloq/mash/issues/35))
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, ...
- Issues principais: [#30](https://github.com/conloq/mash/issues/30) (épico migração), [#32](https://github.com/conloq/mash/issues/32) (CRUD receitas — em revisão), [#38](https://github.com/conloq/mash/issues/38) (auth), [#41](https://github.com/conloq/mash/issues/41) (testes)

## Estrutura

```
src/
├── controllers/     # finos: validam input, mapeiam erros para status HTTP
├── services/        # regras de negócio, exportados como singleton
├── middlewares/     # authMiddleware (JWT), multer
├── models/          # Sequelize, sync({ force: false }) no startup
├── routes/          # routers por entidade
└── config/          # sequelize, cloudinary, associations
```
