// code-wiki:start
// Summary: Define as relações entre conta, receita e rampa de temperatura.
// Description: A conta tem muitas receitas e a receita pertence a uma conta, com a chave estrangeira de usuário declarada nos dois lados.
// A receita tem muitas rampas e a rampa pertence a uma receita, com a chave estrangeira de receita nos dois lados.
// O módulo só declara associações: é importado no arranque da aplicação e não abre conexão nem cria tabela.
// code-wiki:end
import Recipe from '../models/recipeModel.js';
import User from '../models/userModel.js';
import Temperature from '../models/temperatureModel.js';

User.hasMany(Recipe, {
  foreignKey: 'userId',
});

Recipe.belongsTo(User, {
  foreignKey: 'userId',
});

Recipe.hasMany(Temperature, {
  foreignKey: 'recipeId',
});

Temperature.belongsTo(Recipe, {
  foreignKey: 'recipeId',
});
