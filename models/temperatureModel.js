import { DataTypes } from "sequelize";
import Connection from "../config/sequelize-config.js";

const Temperature = Connection.define("temperatures", {
    maxTemperatureRamp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    minTemperatureRamp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxTemperatureLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minTemperatureLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timer: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    initialization: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    idealTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    orderRamp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "recipes",
            key: "id",
        },
        onDelete: 'CASCADE'
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
    tableName: "temperatures",
    timestamps: true
});

export default Temperature;