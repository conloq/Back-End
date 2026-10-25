// code-wiki:start
// Summary: Cria a tabela de contas com identidade, contato, credencial e foto.
// Description: A identidade é autoincrementada, o e-mail é único e nome e senha são obrigatórios.
// Telefone e foto são opcionais, e as marcas de tempo nascem com o padrão do banco.
// A reversão derruba a tabela inteira.
// code-wiki:end
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      password: { type: Sequelize.STRING, allowNull: false },
      url_image: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
