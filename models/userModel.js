import { Sequelize } from "sequelize";
import Connection from "../config/sequelize-config.js";

const User = Connection.define('user',{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    fone: {
       type: Sequelize.STRING,
        allowNull: true,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    url_image: {
        type: Sequelize.STRING,
        allowNull: true, 
    }
});
User.sync({force:false});

export default User;