# #70 — atualização de perfil e upload

Base: `2310ab92b5c9d655ac6735133acf8b05be364467`.

## Estado e delta

Já atendidos: DELETE 204 vazio, GET sem password, identidade via JWT,
limite configurado de 10 MB, upload ausente 400 no envelope error.

Reproduzidos e corrigidos: atualização com o próprio e-mail dava 500;
conflito com e-mail alheio enviava 500 antes de tentar 409; tipos inválidos
causavam 500; e-mail inválido era aceito; assinatura incorreta de fileFilter
e campo multipart imageUser impediam upload. O campo vigente é image.

O Swagger documenta as cinco operações de perfil; login permanece descrito
na mesma especificação e tem sua correção no PR da #38. O campo phone do
controller está exclusivamente no PR da #71, sem duplicar aquela mudança.

## Reprodução

Use banco MySQL local descartável, migrations dessa branch e variáveis de
ambiente de teste. Não carregue .env real. Para substituir explicitamente
apenas o provedor externo:

```sh
NODE_ENV=test CLOUD_NAME=test-only \
NODE_OPTIONS='--import=./scripts/cloudinary-test-double.mjs' node app.js
# Em outro terminal:
PROFILE_TEST_BASE=http://127.0.0.1:8080 node scripts/verify-profile.mjs
```

Forneça também DB_* e demais variáveis obrigatórias com valores de teste.
O duplo recusa ambiente diferente de test/test-only; não entra no boot normal.
O teste cria duas contas próprias e as remove no final.

Node 24.22.0 e MySQL 8.4.9: 12 verificações falhavam antes; as 15 passaram
após a correção. Inclui próprio e-mail, conflito 409, dados inválidos 400,
ausência de foto 400, MIME JPEG/PNG, tipos rejeitados 415, tamanho 413,
persistência da URL sem hash e DELETE 204 vazio. Sintaxe e diff check passaram.

## Limites

Cloudinary REAL: UNVERIFIED; os buffers exercitam multipart/MIME/limite,
sem comprovar decodificação de imagem ou inspeção binária. O teste não é uma
evidência de integração externa. O frontend precisa do PR pareado da #70.
Contrato camelCase depende da #71 e login da #38. A Issue não está Done:
faltam aprovação, merge, comprovação pós-merge e evidências externas.
A #70 continua fora do escopo obrigatório do depósito conforme decisão atual.
