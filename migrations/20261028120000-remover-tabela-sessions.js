// code-wiki:start
// Summary: Remove a tabela de sessão, que deixou de ser usada pelo frontend.
// Description: O frontend em React guarda o JWT no navegador e não mantém mais sessão no servidor, então a tabela fica sem uso.
// A reversão recria a tabela com a mesma estrutura da migration que a criou.
// code-wiki:end
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.dropTable('sessions');
  },

  async down(queryInterface, Sequelize) {
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
};
