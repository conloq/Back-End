// code-wiki:start
// Summary: Descreve a tabela de rampas de temperatura de uma receita, com limites e horários de mosturação.
// Description: São gravados o mínimo e o máximo da rampa e o mínimo e o máximo do limite, todos obrigatórios.
// Os tempos de timer, de inicialização e de tempo ideal são horários obrigatórios; a ordem da rampa é opcional.
// A receita é obrigatória e a exclusão em cascata remove as rampas; as marcas de tempo são mantidas pelo model.
// code-wiki:end
import { DataTypes } from 'sequelize';
import Connection from '../config/sequelize-config.js';

const Temperature = Connection.define(
  'temperatures',
  {
    maxTemperatureRamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minTemperatureRamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxTemperatureLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minTemperatureLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timer: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    initialization: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    idealTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    orderRamp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'temperatures',
    timestamps: true,
  },
);

export default Temperature;
