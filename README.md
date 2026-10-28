# Back-End: Mash API REST

API REST do Mash (migração do app monolítico [`conloq/mash`](https://github.com/conloq/mash)): Express 5 + Sequelize + MySQL.

## Stack

- Node.js (ESM), Express 5, Sequelize, MySQL (database `mash`)
- JWT Bearer + Argon2id (memoryCost 2^16, timeCost 3, parallelism 1)
- Multer (memoryStorage) → Cloudinary
- O frontend (Next.js) chama a API direto do navegador com `Authorization: Bearer`; por isso o CORS precisa liberar a origem dele em `FRONTEND_URL`.
- Swagger: `GET /api-docs`

## Como rodar

```bash
npm install
# o banco precisa existir antes: CREATE DATABASE mash;
npm run db:migrate   # aplica as migrations pendentes
npm start            # aplica migrations via prestart e inicia em PORT (local: 8080)
```

Render define `PORT`; localmente a API usa 8080 por padrão. O frontend local usa a porta 4000.

## Variáveis de ambiente (`.env`: NUNCA commitar valores reais)

```
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_SSL, DB_SSL_CA, DB_DATABASE,
JWT_SECRET_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_KEY_CLOUDINARY
```

Copie o `.env.example` para `.env` e preencha as variáveis do ambiente.
Nunca versione o `.env` nem preencha segredos no arquivo de exemplo.

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
- Os models declaram os atributos em camelCase e a conexão do Sequelize usa `define: { underscored: true }`, que mapeia as colunas em snake_case. As migrations declaram esses nomes físicos; não há código de tradução do JSON.
- Tabelas em inglês, no plural: `users`, `recipes`, `temperatures`, `lots`, `analyses`.
- Rotas em inglês: coleção no plural (`/recipes`, `/lots`, `/analyses`), recurso único no singular (`/user`), `login` à parte; parâmetro de rota `:id`.
- Colunas em português mudam de nome: `nome` → `name`, `fone` → `phone`.
- A regra de 13/10 (banco em camelCase) foi revertida em 15/10; a de 28/09 (snake_case também no JSON) continua substituída.

A especificação dos endpoints do depósito do PI (03/11/2026) está nas issues de [`conloq/mash`](https://github.com/conloq/mash/issues/66): 14 rotas em 3 grupos: 5 de receitas, 4 de rampas de temperatura e 5 de lotes. Rotas de conta não entram nessa contagem.

## Banco e migrations (decisão de 12/10/2026)

- O schema vem das **migrations do Sequelize**: toda tabela ou coluna nova entra por um arquivo em `migrations/`, aplicado com `npm run db:migrate` antes de `npm start` e a cada deploy.
- O `prestart` executa `npm run db:migrate` antes de subir a API. O bootstrap não chama `Connection.sync()`; os models não criam nem alteram tabelas.
- Migration já aplicada no banco publicado não se edita: cria-se uma nova.
- A tabela `sessions` (sessão do antigo frontend EJS) foi removida pela migration `20261028120000-remover-tabela-sessions`: o frontend em React guarda o JWT no navegador e não conecta mais ao banco.
- Comandos: `npx sequelize-cli db:migrate:status` mostra o que já rodou; `npm run db:migrate:undo` desfaz a última (nunca no banco publicado).

### Como rodar as migrations

| Comando                                              | Resultado                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| `CREATE DATABASE mash;`                              | Cria o banco vazio uma vez; a API não cria o banco               |
| `npm run db:migrate`                                 | Aplica as migrations pendentes na ordem dos arquivos             |
| `npm start`                                          | Aplica migrations pelo `prestart` e inicia a API                 |
| `npx sequelize-cli db:migrate:status`                | Lista migrations aplicadas e pendentes                           |
| `npm run db:migrate:undo`                            | Desfaz a última migration no ambiente local                      |
| `npm run db:migrate:undo:all`                        | Desfaz todas no ambiente local; não usar no banco publicado      |
| `npx sequelize-cli migration:generate --name <nome>` | Cria um arquivo que deve usar `export default` neste projeto ESM |

Os ambientes `development` e `production` usam as variáveis `DB_*`. Banco que já recebeu migrations exige uma nova migration para mudar seu schema; as três iniciais foram reconciliadas antes do primeiro deploy, conforme a #71.

Para conferir o schema em um banco descartável vazio, configure `DB_DATABASE` com o prefixo `mash_71_test_` e execute `node scripts/verify-schema.mjs`. O verificador aplica migrations e testa colunas, FKs, timestamps, cascatas, JSON camelCase e reaplicação sem mudanças; recusa banco não vazio e não apaga schemas. A evidência da #71 está em `docs/evidence/71-schema.md`.

`FRONTEND_URL` define a origem liberada no CORS (padrão `http://localhost:4000`). O frontend chama a API direto do navegador, então em produção ela precisa ser a URL publicada do frontend.

## Deploy (decisão de 13/10/2026, [#61](https://github.com/conloq/mash/issues/61))

- API no Render (plano gratuito) e MySQL gerenciado externo (TiDB Cloud), porque o Render gratuito não oferece MySQL. Imagens no Cloudinary.
- O plano gratuito dorme após 15 min sem tráfego: aquecer a API antes da demonstração. A [#68](https://github.com/conloq/mash/issues/68) cria o `GET /health` para o Render saber se a API subiu.
- URLs publicadas: [API](https://back-end-xxq5.onrender.com) · [frontend](https://frontend-a6u4.onrender.com). A API responde em `/health`.

### Configurar o deploy no Render

- Repositório: `conloq/Back-End`, branch `main`, runtime Node, diretório raiz vazio.
- Build command: `npm install`. Start command: `npm run db:migrate && node app.js`.
- Health check path: `/health`. A rota responde `200 { "message": "ok" }`.
- Configure `NODE_ENV=production`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SSL=true`, `JWT_SECRET_KEY` e as três variáveis do Cloudinary. O Render fornece `PORT` automaticamente. `FRONTEND_URL` deve ser a URL publicada do frontend.
- No TiDB Cloud, copie host, porta, usuário, senha e banco da opção de conexão pública MySQL. A porta é a exibida pelo painel (Starter normalmente usa 4000). TiDB Cloud exige TLS; `DB_SSL_CA` é opcional para Starter quando a cadeia padrão do Node é aceita e deve receber o PEM se o painel/plano fornecer uma CA específica. Nunca versione valores reais. TiDB Cloud só suporta `lower_case_table_names=2`; mantenha nomes físicos de tabelas em minúsculas e valide as migrations no cluster escolhido.
- No plano gratuito, o serviço pode dormir após inatividade; faça uma chamada à API antes da demonstração.

### Rollback

Use o rollback do Render para voltar ao deploy anterior da aplicação. Isso não desfaz migrations. Antes de qualquer reversão de schema, faça backup e confirme que o `down` da migration é seguro para os dados atuais; não execute `db:migrate:undo` automaticamente em produção.

## Regras de contribuição

- **Nunca commitar direto na `main`**: branch própria + Pull Request obrigatório (ver [#35](https://github.com/conloq/mash/issues/35)). Aprovação humana obrigatória: **0**; revisão por pares pode ocorrer, mas não é requisito de aprovação.
- **Proteções e automação:** CodeRabbit pode comentar e CodeQL pode reportar achados. Essas ferramentas, por si só, não definem um gate de merge. Consulte ao vivo as branch protections, rulesets, checks obrigatórios, resolução de conversas e permissões antes de afirmar se o merge está liberado.
- Conventional Commits em pt-BR: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`. Branch `<tipo>/<número da issue>-<descrição-curta>`; o Pull Request fecha a issue com `Closes conloq/mash#NN`.
- Cada rota entregue é documentada em `config/swagger.json` no mesmo Pull Request e tem a validação manual registrada na [#41](https://github.com/conloq/mash/issues/41).
- Épicos em `conloq/mash`: [#30](https://github.com/conloq/mash/issues/30) (base da API: padrões, schema e evidências), [#83](https://github.com/conloq/mash/issues/83) (conta e segurança), [#80](https://github.com/conloq/mash/issues/80) (receitas e rampas), [#81](https://github.com/conloq/mash/issues/81) (lotes) e [#82](https://github.com/conloq/mash/issues/82) (teste de iodo). O recorte vigente do semestre está na [#66](https://github.com/conloq/mash/issues/66).

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
