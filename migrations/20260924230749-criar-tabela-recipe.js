// code-wiki:start
// Summary: Cria a tabela de receitas com vínculo obrigatório e propagação em cascata.
// Description: A identidade é autoincrementada e o nome é obrigatório.
// O usuário é obrigatório, e a exclusão ou a alteração do usuário propaga para as receitas.
// As marcas de tempo nascem com o padrão do banco, e a reversão derruba a tabela.
// code-wiki:end
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipes');
  },
};
