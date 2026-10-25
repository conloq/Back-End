// code-wiki:start
// Summary: Monta o bloco de conexão do banco para os ambientes de desenvolvimento e de produção.
// Description: Credenciais, host, porta e nome do banco vêm do ambiente, com a porta padrão do MySQL quando nada é informado.
// TLS entra no dialeto quando o ambiente pede SSL, e a autoridade certificadora é acrescentada quando existe.
// Desenvolvimento e produção compartilham o mesmo bloco, e o fuso horário fica fixo no do projeto.
// code-wiki:end
import 'dotenv/config';

const dialectOptions =
  process.env.DB_SSL === 'true' || process.env.DB_SSL_CA
    ? {
        ssl: {
          minVersion: 'TLSv1.2',
          ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : {}),
        },
      }
    : undefined;

const db = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  ...(dialectOptions ? { dialectOptions } : {}),
  dialect: 'mysql',
  timezone: '-03:00',
};

export default { development: db, production: db };
