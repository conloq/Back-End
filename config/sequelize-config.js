// code-wiki:start
// Summary: Compartilha a conexão Sequelize com atributos camelCase e colunas snake_case.
// Description: A conexão MySQL reúne credenciais, host e porta do ambiente, com TLS opcional e fuso fixo do projeto.
// A opção de definição ativa o underscored, que faz o atributo camelCase do model virar coluna snake_case na tabela.
// As migrations são a origem do schema; este módulo não sincroniza nem altera tabela alguma.
// code-wiki:end
import { Sequelize } from 'sequelize';

const dialectOptions =
  process.env.DB_SSL === 'true' || process.env.DB_SSL_CA
    ? {
        ssl: {
          minVersion: 'TLSv1.2',
          ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : {}),
        },
      }
    : undefined;

const Connection = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 3306),
  ...(dialectOptions ? { dialectOptions } : {}),
  timezone: '-03:00',
  define: {
    underscored: true,
  },
});

export default Connection;
