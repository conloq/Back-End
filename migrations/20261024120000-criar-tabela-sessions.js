'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'sessions',
      {
        session_id: { type: Sequelize.STRING(128), primaryKey: true, allowNull: false },
        expires: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
        data: { type: Sequelize.TEXT('medium'), allowNull: true },
      },
      { engine: 'InnoDB', charset: 'utf8mb4', collate: 'utf8mb4_bin' },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  },
};
