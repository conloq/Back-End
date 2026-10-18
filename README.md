# Back-End: Mash API REST

API REST do Mash (migração do app monolítico [`conloq/mash`](https://github.com/conloq/mash)): Express 5 + Sequelize + MySQL.

## Stack

- Node.js (ESM), Express 5, Sequelize, MySQL (database `mash`)
- JWT Bearer + Argon2id (memoryCost 2^16, timeCost 3, parallelism 1)
- Multer (memoryStorage) → Cloudinary
- CORS liberado para o frontend (`FRONTEND_URL`, padrão `http://localhost:4000`): o navegador chama a API direto, com o token no `Authorization: Bearer`
- Swagger: `GET /api-docs`

## Como rodar

```bash
npm install
# o banco precisa existir antes: CREATE DATABASE mash;
npm run db:migrate   # aplica as migrations pendentes
npm start            # porta 8080
```

A API usa a porta 8080; o frontend usa a 4000.

## Variáveis de ambiente (`.env`: NUNCA commitar valores reais)

```
DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE,
JWT_SECRET_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_KEY_CLOUDINARY,
FRONTEND_URL
```

O `.env.example` com esses nomes entra pela [#39](https://github.com/conloq/mash/issues/39).

## Padrão de resposta (decisão da equipe: base: aula-05 DW3)

**Sucesso:**
- Operação sem entidade: `{ "message": "<texto>" }`, ex.: `{ "message": "Receita criada com sucesso" }`
- Operação que devolve entidade: `{ "message": "<texto>", "<singular>": { ... } }`
- Detalhe: `{ "<singular>": { ... } }`, ex.: `{ "recipe": { ... } }`
- Listagem: `{ "<plural>": [ ... ] }`, ex.: `{ "recipes": [...] }`
- **Não usar wrapper genérico `data`.**

**Erro** (string direta em português, sem código interno):
- `400`: `{ "error": "<regra de validação>" }`, ex.: `{ "error": "Nome é obrigatório" }`
- `401`: `{ "error": "Token inválido ou expirado" }`
- `404`: `{ "error": "<Recurso> não encontrado" }`: também para recurso de outro usuário, em leitura, alteração e exclusão (não revelar existência)
- `409`: `{ "error": "Receita já existe" }`
- `413`: imagem acima de 10 MB; `415`: arquivo que não é JPEG nem PNG
- `500`: `{ "error": "Erro interno do servidor" }`

**DELETE:** `204` sem corpo: encerrar com `res.sendStatus(204)`

## Nomes (decisão de 08/10/2026, reafirmada em 15/10/2026, #30)

- O **JSON** usa camelCase em inglês: `userId`, `recipeId`, `urlImage`, `mashStart`, `collectedAt`, `createdAt`. Vale no corpo da requisição, nos campos de formulário e na resposta.
- O **banco** usa snake_case em inglês, nas tabelas e colunas: `user_id`, `recipe_id`, `url_image`, `mash_start`, `collected_at`, `created_at`, `updated_at`.
- Os models declaram os atributos em camelCase e a conexão do Sequelize usa `define: { underscored: true }`, que gera as colunas em snake_case; ninguém escreve código de tradução. Hoje o `underscored` está na raiz do `new Sequelize({...})`, onde não tem efeito; a [#71](https://github.com/conloq/mash/issues/71) o move para `define`.
- Tabelas em inglês, no plural: `users`, `recipes`, `temperatures`, `lots`, `analyses`.
- Rotas em inglês: coleção no plural (`/recipes`, `/lots`, `/analyses`), recurso único no singular (`/user`), `login` à parte; parâmetro de rota `:id`.
- Colunas em português mudam de nome: `nome` → `name`, `fone` → `phone`.
- A regra de 13/10 (banco em camelCase) foi revertida em 15/10; a de 28/09 (snake_case também no JSON) continua substituída.

A especificação dos endpoints do depósito do PI (03/11/2026) está nas issues de [`conloq/mash`](https://github.com/conloq/mash/issues/66): 14 rotas em 6 grupos, uma issue por grupo de rotas.

## Banco e migrations (decisão de 12/10/2026)

### Como rodar as migrations

| Comando | O que faz |
|---|---|
| `CREATE DATABASE mash;` | Cria o banco vazio, uma vez; a API não o cria mais |
| `npm run db:migrate` | Aplica as migrations pendentes, em ordem de nome de arquivo |
| `npm start` | Com o `prestart`, aplica as migrations pendentes e depois sobe a API |
| `npx sequelize-cli db:migrate:status` | Mostra quais já rodaram (`up`) e quais faltam (`down`) |
| `npm run db:migrate:undo` | Desfaz a última migration aplicada |
| `npm run db:migrate:undo:all` | Desfaz todas; nunca no banco publicado |
| `npx sequelize-cli migration:generate --name <nome>` | Cria um arquivo novo em `migrations/` |


## Deploy (decisão de 13/10/2026, [#61](https://github.com/conloq/mash/issues/61))

- API no Render (plano gratuito) e MySQL gratuito externo (Aiven), porque o Render gratuito não oferece MySQL. Imagens no Cloudinary.
- O plano gratuito dorme após 15 min sem tráfego: aquecer a API antes da demonstração. A [#68](https://github.com/conloq/mash/issues/68) cria o `GET /health` para o Render saber se a API subiu.
- Definir `FRONTEND_URL` com a URL do frontend publicado ([#69](https://github.com/conloq/mash/issues/69)).

## Regras de contribuição

- **Nunca commitar direto na `main`**: branch própria + pull request + peer review (ver [#35](https://github.com/conloq/mash/issues/35)). O repositório é público e a `main` é protegida: exige Pull Request com 1 aprovação.
- Revisão automática: o `.github/CODEOWNERS` pede a revisão do Tech Lead, o CodeRabbit comenta o Pull Request em português (`.coderabbit.yaml`) e o CodeQL analisa o código (Security > Code scanning). Nenhum deles aprova ou bloqueia o merge.
- Conventional Commits em pt-BR: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`. Branch `<tipo>/<número da issue>-<descrição-curta>`; o Pull Request fecha a issue com `Closes conloq/mash#NN`.
- Cada rota entregue é documentada em `config/swagger.json` no mesmo Pull Request e tem a validação manual registrada na [#41](https://github.com/conloq/mash/issues/41).
- Épicos do depósito em `conloq/mash`: [#30](https://github.com/conloq/mash/issues/30) (base da API: padrões, schema e evidências), [#83](https://github.com/conloq/mash/issues/83) (conta e segurança), [#80](https://github.com/conloq/mash/issues/80) (receitas e rampas), [#81](https://github.com/conloq/mash/issues/81) (lotes) e [#82](https://github.com/conloq/mash/issues/82) (teste de iodo: envio, consulta e histórico). A análise por visão computacional (OpenCV, [#34](https://github.com/conloq/mash/issues/34)) fica para o próximo semestre.

## Estrutura

```
├── controllers/     # finos: validam input, mapeiam erros para status HTTP
├── services/        # regras de negócio, exportados como singleton (export default new X())
├── middlewares/     # authMiddleware (JWT), multer
├── models/          # Sequelize via Connection; atributos em camelCase, colunas em snake_case (underscored)
├── routes/          # routers por entidade
├── migrations/      # fonte do schema; aplicar com npm run db:migrate
└── config/          # sequelize, cloudinary, associations, swagger
```
