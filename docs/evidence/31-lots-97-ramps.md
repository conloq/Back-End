# #31, #92 e #97: lotes e edição de rampas

Base: Back-End main `52438c8`, com as alterações deste Pull Request ainda sem commit.

## Delta

Tabela `lots` pela migration `20261029120000-criar-tabela-lot` (`name`, `user_id`, `recipe_id`, `mash_start`, `status` ativo ou concluído). Rotas `GET`/`POST /lots` e `GET`/`PUT`/`DELETE /lots/:id`, com envelopes `lots`/`lot`. `DELETE /recipes/:id` responde 409 quando a receita tem lote. Rampas ganham `PUT` e `DELETE /temperatures/:id`, com a mesma validação da criação. As sete rotas estão no `config/swagger.json`.

## Validação

Banco MySQL local descartável (`mash_71_test_*`), criado com `sequelize-cli db:create`, migrations aplicadas do zero e banco removido no fim. API iniciada com `node app.js`, chamadas com `curl`, duas contas (A e B). Resultado em 29/10/2026:

| Rota                             | Cenário                         | Status                                                            |
| -------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `PUT /temperatures/1`            | sucesso (conta A)               | 200 com `message` e `temperature`                                 |
| `PUT /temperatures/1`            | temperatura 150                 | 400                                                               |
| `PUT /temperatures/abc`          | ID inválido                     | 400                                                               |
| `PUT` e `DELETE /temperatures/1` | conta B                         | 404 "Rampa não encontrada"                                        |
| `PUT /temperatures/1`            | sem token                       | 401                                                               |
| `DELETE /temperatures/1`         | sucesso                         | 204 sem corpo                                                     |
| `POST /lots`                     | sucesso                         | 201 com `message` e `lot`, `status` `active` e `mashStart` padrão |
| `POST /lots`                     | nome vazio                      | 400                                                               |
| `POST /lots`                     | receita da conta A usada pela B | 404 "Receita não encontrada"                                      |
| `GET /lots`                      | conta A / conta B               | 200 com o lote / 200 com lista vazia                              |
| `GET /lots/1`                    | conta A / conta B               | 200 / 404 "Lote não encontrado"                                   |
| `GET /lots/1abc`                 | ID inválido                     | 400                                                               |
| `GET /lots`                      | sem token                       | 401                                                               |
| `PUT /lots/1`                    | sucesso, `status` `completed`   | 200 com `message`                                                 |
| `PUT /lots/1`                    | `status` inválido               | 400                                                               |
| `PUT` e `DELETE /lots/1`         | conta B                         | 404                                                               |
| `DELETE /recipes/1`              | receita com lote                | 409 "Receita possui lotes vinculados"                             |
| `DELETE /lots/1`                 | sucesso                         | 204 sem corpo; `GET` seguinte responde 404                        |
| `DELETE /recipes/1`              | sem lote                        | 204                                                               |

Não validado aqui: o ambiente publicado (#68) e a tela da #97 no `conloq/frontend`.
