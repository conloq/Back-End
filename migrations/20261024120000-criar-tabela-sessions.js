// code-wiki:start
// Summary: Cria a tabela de armazenamento de sessão da aplicação.
// Description: A chave é o identificador da sessão, com tamanho fixo, e a expiração é um inteiro sem sinal.
// O estado serializado é opcional e guardado em texto médio.
// A tabela usa InnoDB com charset e collation binária, para comparar a chave de sessão de forma exata.
// code-wiki:end
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
