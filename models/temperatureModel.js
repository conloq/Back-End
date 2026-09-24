import { INTEGER, Sequelize } from "sequelize";
import Connection from "../config/sequelize-config.js";

const Temperature = Connection.define("Temperature", {
    max_temperature_ramp: {
        type: INTEGER,
        allowNull: false
    },
    min_temperature_ramp: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    max_temperature_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    min_temperature_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    timer: {
        type: Sequelize.DataTypes.TIME,
        allowNull: false,
    },
    initialization: {
        type: Sequelize.DataTypes.TIME,
        allowNull: false,
    },
    ideal_time: {
        type: Sequelize.DataTypes.TIME,
        allowNull: false,
    },
    active_temperature: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: false,
    },
    recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "receitas",
            key: "id",
        },
        onDelete: 'CASCADE'
    }
});
Temperature.sync({force:false});

export default Temperature;