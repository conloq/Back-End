// code-wiki:start
// Summary: Compartilha a conexao Sequelize com atributos camelCase e colunas snake_case.
// Description: Define underscored para todos os models; o schema fisico vem das migrations.
// code-wiki:end
import { Sequelize } from "sequelize";

const Connection = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: "-03:00",
    define: {
        underscored: true
    }
})

export default Connection;
