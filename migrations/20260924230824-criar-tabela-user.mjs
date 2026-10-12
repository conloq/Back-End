'use strict';

/** @type {import('sequelize-cli').Migration} */
export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: Sequelize.STRING, allowNull: false},
      email: {type: Sequelize.STRING, allowNull: false, unique: true},
      fone: {type: Sequelize.STRING, allowNull: true},
      password: {type: Sequelize.STRING, allowNull: false},
      url_image: {type: Sequelize.STRING, allowNull: true},
      created_At: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW')},
      updated_At: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW')}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
