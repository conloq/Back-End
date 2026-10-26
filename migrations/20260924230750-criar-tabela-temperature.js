// code-wiki:start
// Summary: Cria a tabela de rampas com limites, horários de mosturação e vínculo com a receita.
// Description: São gravados o mínimo e o máximo da rampa, o mínimo e o máximo do limite e três horários, todos obrigatórios.
// A ordem da rampa é opcional, e a receita é obrigatória com propagação em cascata na exclusão e na alteração.
// A reversão derruba a tabela.
// code-wiki:end
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('temperatures', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      max_temperature_ramp: { type: Sequelize.INTEGER, allowNull: false },
      min_temperature_ramp: { type: Sequelize.INTEGER, allowNull: false },
      max_temperature_limit: { type: Sequelize.INTEGER, allowNull: false },
      min_temperature_limit: { type: Sequelize.INTEGER, allowNull: false },
      timer: { type: Sequelize.TIME, allowNull: false },
      initialization: { type: Sequelize.TIME, allowNull: false },
      ideal_time: { type: Sequelize.TIME, allowNull: false },
      order_ramp: { type: Sequelize.INTEGER, allowNull: true },
      recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('temperatures');
  },
};
