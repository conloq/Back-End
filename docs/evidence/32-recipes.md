# #32: receitas e rampas

Base: Back-End main `6958bf4e00cef38dedd65a1cdfa705a8d0ec5388`. Models, migrations e associações do João preservados sem alterações.

## Delta

Rotas `/recipes`, detalhe conectado, envelopes `recipes`/`recipe`, IDs inteiros positivos, nome com trim e duplicidade por usuário sem diferenciar caixa. Rampas em `/recipes/:id/temperatures`, campos camelCase, `orderRamp` persistido, sem activeTemperature; inteiros de 0 a 100, mínimo ≤ máximo e horários HH:MM:SS. Lista ordenada por orderRamp e id. Cinco operações documentadas no Swagger.

PUT/DELETE existentes receberam o caminho em inglês para acompanhar a #86. Não se declara concluída a #93: sua regra de vínculo com lotes depende da entrega dos lotes.

## Reprodução

Em checkout isolado, usar um banco MySQL novo e exclusivo com prefixo `mash_71_test_`, configurar apenas variáveis sintéticas e `DOTENV_CONFIG_PATH=/dev/null`. Nunca executar contra API publicada ou banco de trabalho.

1. `npm run db:migrate` e `node app.js`, com DB_HOST/DB_USERNAME/DB_PASSWORD/DB_DATABASE e demais variáveis obrigatórias de teste.
2. `RECIPE_TEST_BASE=http://127.0.0.1:8080 node scripts/verify-recipes.mjs`.
3. `AUTH_TEST_BASE=http://127.0.0.1:8080 node scripts/verify-auth.mjs`.

MySQL 8.4.9 case-sensitive, Node 24.22.0, dependências do lockfile. Resultado em 20/10/2026: 119 verificações de status/Swagger passaram, mais assertions de payload, persistência e autorização; regressão de autenticação passou (14 verificações). A suite cria duas contas sintéticas e remove somente essas contas ao terminar. DATETIME das migrations existentes persiste segundos; o teste considera essa precisão ao comparar timestamps da criação com a leitura posterior.

Cenários: conta sem receitas; criação com trim; nome vazio/tipo inválido/longo; duplicidade por caixa e espaços; mesmo nome entre contas distintas; identidade não aceita do corpo; detalhe e lista próprios; ausência/token inválido; IDs inválidos; inexistente/alheio com o mesmo 404; campos obrigatórios/tipos; limites 0/100, negativos, 101 e frações; mínimo maior que máximo; horários inválidos; orderRamp opcional e inválido; persistência camelCase e ordenação; edição e exclusão existentes; Swagger e Bearer.

A #86 foi testada contra esta API no navegador em desktop e mobile. CORS local passou no fluxo real. Deploy público, DB_PORT, PORT e proxy permanecem na #68/#69.

Esta evidência registra a validação da branch; o fechamento da Issue exige revalidar os SHAs mesclados.
