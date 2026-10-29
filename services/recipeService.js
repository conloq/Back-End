// code-wiki:start
// Summary: Persiste receitas com nomes normalizados por usuário.
// Description: Os nomes são comparados sem caixa e sem espaços nas pontas, para não repetir receita do mesmo usuário.
// A lista sai por identificador crescente e o detalhe busca pela chave primária, sem filtro de dono.
// A alteração restringe a escrita ao par receita e usuário.
// code-wiki:end
import { Op, fn, col, where } from 'sequelize';
import Recipe from '../models/recipeModel.js';

class RecipeUser {
  async createRecipe(nameRecipe, userId) {
    const recipe = await Recipe.create({ name: nameRecipe, userId: userId });
    return recipe;
  }

  async showRecipes(userId) {
    const recipeList = await Recipe.findAll({
      where: { userId: userId },
      order: [['id', 'ASC']],
    });
    return recipeList;
  }

  async showOneRecipe(recipeId) {
    const recipe = await Recipe.findByPk(recipeId);
    return recipe;
  }

  // Compara sem maiúscula/minúscula e sem espaço nas pontas: "Pilsen" = " pilsen "
  // exceptId serve para o update não achar a própria receita
  async showRecipeByName(nameRecipe, userId, exceptId) {
    const filtro = {
      userId: userId,
      [Op.and]: where(fn('LOWER', fn('TRIM', col('name'))), nameRecipe.trim().toLowerCase()),
    };

    if (exceptId) filtro.id = { [Op.ne]: exceptId };

    const recipe = await Recipe.findOne({ where: filtro });
    return recipe;
  }

  async deleteRecipe(recipeId) {
    const destroy = await Recipe.destroy({
      where: { id: recipeId },
    });

    if (destroy === 0) throw new Error('ID_NOT_EXISTING');
  }

  async updateRecipe(recipeId, nameRecipe, userId) {
    const update = await Recipe.update(
      { name: nameRecipe },
      { where: { id: recipeId, userId: userId } },
    );
    return update;
  }
}

export default new RecipeUser();
