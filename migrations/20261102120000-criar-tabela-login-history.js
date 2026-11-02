// code-wiki:start
// Summary: Cria a tabela do histórico de login, com um registro por entrada bem-sucedida na conta.
// Description: Segue o login_history do schema complementar do conloq/database: IP, localidade aproximada, IP já conhecido e data e hora.
// A conta é obrigatória com propagação em cascata, então excluir a conta apaga o histórico; há índices em user_id e logged_at.
// A reversão derruba a tabela.
// code-wiki:end
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('login_history', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ip_address: { type: Sequelize.STRING, allowNull: false },
      logged_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      location: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.BOOLEAN, allowNull: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('login_history', ['user_id'], {
      name: 'idx_login_history_user_id',
    });
    await queryInterface.addIndex('login_history', ['logged_at'], {
      name: 'idx_login_history_logged_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('login_history');
  },
};
