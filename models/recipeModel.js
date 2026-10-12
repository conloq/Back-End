import {DataTypes} from "sequelize";
import Connection from "../config/sequelize-config.js";

const Recipe = Connection.define("recipes", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'users',
            key: 'id'
        }
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
    tableName: "recipes",
    timestamps: true
});


export default Recipe;