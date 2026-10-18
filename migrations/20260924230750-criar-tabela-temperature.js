'use strict';

/** @type {import('sequelize-cli').Migration} */
export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('temperatures', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      maxTemperatureRamp: {type: Sequelize.INTEGER,allowNull: false},
      minTemperatureRamp: {type: Sequelize.INTEGER, allowNull: false},
      maxTemperatureLimit: {type: Sequelize.INTEGER,allowNull: false,},
      minTemperatureLimit: {type: Sequelize.INTEGER,allowNull: false},
      timer: {type: Sequelize.TIME,allowNull: false},
      initialization: {type: Sequelize.TIME,allowNull: false,},
      idealTime: {type: Sequelize.TIME,allowNull: false},
      orderRamp: {type: Sequelize.INTEGER,allowNull: true},
      recipeId: {type: Sequelize.INTEGER, allowNull: false,
        references: {
            model: "recipes",
            key: "id",
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
      createdAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW')},
      updatedAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW')}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('temperatures');
  }
};
