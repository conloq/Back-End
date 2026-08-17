import { Sequelize } from "sequelize";

const Connection = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    timezone: "-03:00",
    database: "mash"
})

export default Connection;