# #39 — exemplo de ambiente e boot

Base verificada: `2310ab92b5c9d655ac6735133acf8b05be364467`.

O boot já validava as variáveis obrigatórias. O delta corrigido foi retirar
qualquer valor de JWT do exemplo, completar os nomes previstos na Issue e
orientar a cópia do exemplo no README. Nenhum `.env` real foi lido.

- PASS: `JWT_SECRET_KEY=` no exemplo.
- PASS: boot sem JWT termina com código 1, cita o nome e não imprime valores.
- PASS: boot sem todas as variáveis obrigatórias termina com código 1.
- PASS: `git ls-files .env` vazio; `git check-ignore .env` retorna `.env`.

`DB_PORT` é documentada; sua implementação pertence à #68. A inicialização
normal com banco foi exercitada na evidência da #71. Esta evidência não
representa aprovação, merge ou comprovação pós-merge da #39.
