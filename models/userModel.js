// code-wiki:start
// Summary: Descreve a tabela de contas: identidade, contato, credencial e foto de perfil.
// Description: A identidade é um inteiro autoincrementado; nome, e-mail e senha são obrigatórios e o e-mail é único.
// Telefone e foto são opcionais, e as marcas de criação e atualização ficam sob controle do model.
// O nome físico da tabela é fixado aqui, para casar com a migration que a cria.
// code-wiki:end
import { DataTypes } from 'sequelize';
import Connection from '../config/sequelize-config.js';

const User = Connection.define(
  'users',
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    urlImage: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'users',
    timestamps: true,
  },
);

export default User;
