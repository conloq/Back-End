// code-wiki:start
// Summary: Descreve a tabela de receitas, sempre vinculada a uma conta.
// Description: A identidade é um inteiro autoincrementado e o nome é obrigatório.
// O vínculo com a conta é obrigatório e aponta para a chave da tabela de usuários, o que derruba as receitas quando a conta sai.
// As marcas de criação e atualização são mantidas pelo model, e o nome físico da tabela é fixado aqui.
// code-wiki:end
import { DataTypes } from 'sequelize';
import Connection from '../config/sequelize-config.js';

const Recipe = Connection.define(
  'recipes',
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
    tableName: 'recipes',
    timestamps: true,
  },
);

export default Recipe;
