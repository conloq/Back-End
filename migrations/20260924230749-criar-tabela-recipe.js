'use strict';

/** @type {import('sequelize-cli').Migration} */
export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('recipes',{
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: Sequelize.STRING, allowNull: false,},
      userId:{type: Sequelize.INTEGER, allowNull: false,
        references:{
            model: 'users',
            key: 'id',
            onDelete: 'CASCADE'
          }
        },
      createdAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW')},
      updatedAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW')}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('recipes');
  }
};
