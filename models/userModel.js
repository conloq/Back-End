import { DataTypes } from "sequelize";
import Connection from "../config/sequelize-config.js";

const User = Connection.define('users',{
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fone: {
       type: DataTypes.STRING,
        allowNull: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    url_image: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    created_At: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_At: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: 'users',
    timestamps: true
});

export default User;