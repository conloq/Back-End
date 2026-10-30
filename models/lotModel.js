// code-wiki:start
// Summary: Descreve a tabela de lotes, vinculada à conta e a uma receita dela.
// Description: O nome é obrigatório, e o início da mosturação assume a data e hora do cadastro quando não vem.
// O estado é ativo ou concluído, com ativo por padrão.
// Conta e receita são obrigatórias; as marcas de criação e atualização são mantidas pelo model.
// code-wiki:end
import { DataTypes } from 'sequelize';
import Connection from '../config/sequelize-config.js';

const Lot = Connection.define(
  'lots',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id',
      },
    },
    mashStart: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed'),
      allowNull: false,
      defaultValue: 'active',
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
    tableName: 'lots',
    timestamps: true,
  },
);

export default Lot;
