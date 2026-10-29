# #71: schema por migrations e nomes físicos snake_case

## Estado inicial

Revalidação em 19/10/2026 sobre `conloq/Back-End` `2310ab92b5c9d655ac6735133acf8b05be364467`, contra os corpos atuais de conloq/mash#71, #30 e #66. Checkboxes e capturas anteriores não foram usados como prova de implementação.

Classificação: **IMPLEMENTATION BUG**. A decisão permanece JSON/models camelCase e banco snake_case.

| Critério                                                | Antes    | Delta desta branch                                                |
| ------------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| Tabelas users/recipes/temperatures, sem sync individual | DONE     | Preservado                                                        |
| Models camelCase e FKs não anuláveis                    | DONE     | Preservado                                                        |
| define.underscored                                      | NOT DONE | Configurado na conexão                                            |
| Colunas físicas e timestamps snake_case                 | NOT DONE | Corrigidos nas três migrations iniciais, antes do primeiro deploy |
| FK recipes → users com CASCADE                          | PARTIAL  | Ações movidas para o nível da coluna, como exige a queryInterface |
| Perfil recebe phone                                     | PARTIAL  | Controller usa phone nas duas variantes de atualização            |
| Ambiente production, prestart e bootstrap sem sync      | DONE     | Preservados e exercitados                                         |
| README de migrations                                    | PARTIAL  | Removidas afirmações vencidas e incluída tabela dos comandos      |
| Frontend de perfil                                      | NOT DONE | PR separado no conloq/frontend, também vinculado à #71            |
| Revisão, merge e revalidação da main                    | NOT DONE | Aguardam o fluxo do PR; a issue não está Done                     |

A reprodução inicial aplicou as três migrations sem erro, mas `information_schema.COLUMNS` mostrou `urlImage`, `createdAt` e `updatedAt` em `users`.

## Ambiente isolado

- MySQL Community Server 8.4.9, Linux, `lower_case_table_names=0`.
- Node 24.22.0, Sequelize 6.37.8 e sequelize-cli 6.6.5, conforme lockfile.
- Servidor local descartável, diretório exclusivo em `/tmp`; nenhum banco do usuário ou publicado foi usado.
- Bancos novos separados para a reprodução anterior, a correção em production e a correção em development.
- Variáveis e credenciais sintéticas de teste; nenhum segredo de ambiente real foi lido ou incluído.

## Validação

Resultados obtidos nos dois ambientes:

- Migrations executadas do zero; exatamente `users`, `recipes`, `temperatures` e a tabela interna `SequelizeMeta`.
- Todas as colunas de negócio em snake_case; `created_at`/`updated_at` não anuláveis nas três tabelas.
- `recipes.user_id → users.id` e `temperatures.recipe_id → recipes.id`, não anuláveis, com DELETE/UPDATE CASCADE.
- Models usam atributos camelCase e mapeiam para os nomes físicos; gravação/leitura de usuário, receita e rampa passou.
- FK inválida rejeitada pelo MySQL; exclusão do usuário remove receita e rampa em cascata.
- `createdAt` serializado como atributo camelCase; nenhuma chave snake_case nas entidades dos models.
- Segunda execução de `npm run db:migrate`: nenhuma migration pendente e mesmas três entradas no SequelizeMeta.
- Rollback completo e reaplicação passaram somente no banco descartável criado para a conferência. Não executar rollback no banco publicado.

## Bootstrap e HTTP

Resultados observados com NODE_ENV=production:

| Cenário                                                        | Resultado                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| npm start aplica prestart e sobe com as traps de sync ativas   | PASS                                                           |
| GET /api-docs/                                                 | 200                                                            |
| POST /user com conta sintética não Gmail                       | 201                                                            |
| POST /login dessa conta                                        | 200; JWT não transcrito na evidência                           |
| GET /user autenticado                                          | 200, phone/urlImage/createdAt/updatedAt, sem password          |
| PUT /user com phone e um novo e-mail disponível; GET posterior | 200; telefone persistido                                       |
| POST /receitas na rota atual                                   | 201; JSON com userId e timestamps camelCase, banco com user_id |

O login ainda devolve a chave pública `image`: divergência da #38, mantida fora desta branch. O caso de atualizar com o próprio e-mail existente também pertence à #70. As rotas em inglês e as validações de rampa continuam nas #32/#97.

## Limites para fechamento

Esta é evidência **pré-merge** da branch. Aprovação, merge, conferência da main e integração do PR de perfil continuam necessários. #50/#87 podem consultar os nomes físicos desta evidência, mas a conferência final deve usar o SHA mesclado. Não foi enviado aviso direto a integrantes nem alterado checklist/status no GitHub.
