# #38 — autenticação e isolamento

Base: `2310ab92b5c9d655ac6735133acf8b05be364467`.

## Delta comprovado

Já estavam corretos: login 400/401 no envelope `error`, ausência de
`console.log(user)`, cadastro com domínio não Gmail, perfil sem hash e
identidade obtida pelo JWT. Não foram reimplementados.

Corrigidos: `user.urlImage` no login; Bearer JWT e respostas do login no
Swagger; resposta 404 idêntica para receita inexistente ou pertencente a
outro usuário nas operações já disponíveis, incluindo acesso às rampas.
Isso evita revelar a existência de recursos alheios.

## Reprodução

Use exclusivamente uma API local descartável em `127.0.0.1:8080`, com
MySQL vazio e credenciais de teste. Execute as migrations dessa branch e
inicie `node app.js`; forneça as variáveis obrigatórias por ambiente.
Depois execute:

```sh
AUTH_TEST_BASE=http://127.0.0.1:8080 node scripts/verify-auth.mjs
```

O script cria duas contas temporárias, faz requisições HTTP reais, verifica
login/perfil/isolamento e remove as próprias contas. Nunca use uma API
com dados de trabalho. O Swagger é validado diretamente do JSON versionado.

Node 24.22.0, MySQL 8.4.9, dependências do lock: antes da correção,
8 verificações falharam; depois, 14 verificações passaram. Os cenários
que já passavam continuaram passando. Nenhum token é impresso pelo teste.

## Limites

Não adiciona rotas ainda ausentes (#31/#32/#1/#33), nem implementa regras
de rampa (#97). A rota de detalhe exportada mas não conectada continua
no escopo da #32. A evidência histórica da #41 não substituiu a reprodução.
A Issue permanece sem conclusão até aprovação, merge e revalidação da main.
