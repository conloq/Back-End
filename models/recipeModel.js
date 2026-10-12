import {DataTypes} from "sequelize";
import Connection from "../config/sequelize-config.js";

const Recipe = Connection.define("recipes", {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'users',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: "recipes",
    timestamps: true
});


export default Recipe;