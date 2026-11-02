// code-wiki:start
// Summary: Descreve a tabela do histórico de login: IP, localidade, IP conhecido e data e hora de cada entrada.
// Description: A conta é obrigatória; o status indica se o IP já tinha aparecido em entradas anteriores da mesma conta.
// A data e hora da entrada fica em loggedAt; as marcas de criação e atualização são mantidas pelo model.
// code-wiki:end
import { DataTypes } from 'sequelize';
import Connection from '../config/sequelize-config.js';

const LoginHistory = Connection.define(
  'login_history',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    loggedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: 'login_history',
    timestamps: true,
  },
);

export default LoginHistory;
