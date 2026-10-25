// code-wiki:start
// Summary: Persiste receitas com nomes normalizados por usuário.
// Description: Os nomes são comparados sem caixa e sem espaços nas pontas, para não repetir receita do mesmo usuário.
// A lista sai por identificador crescente e o detalhe busca pela chave primária, sem filtro de dono.
// A alteração recusa nome já usado pelo mesmo usuário e restringe a escrita ao par receita e usuário.
// code-wiki:end
import { Op, fn, col, where } from 'sequelize';
import Recipe from '../models/recipeModel.js';
class RecipeUser {
  async createRecipe(name, userId) {
    if (await this.showRecipeByName(name, userId)) throw new Error('RECIPE_EXISTS');
    return Recipe.create({ name, userId });
  }
  async showRecipes(userId) {
    return Recipe.findAll({ where: { userId }, order: [['id', 'ASC']] });
  }
  async showOneRecipe(id) {
    return Recipe.findByPk(id);
  }
  async showRecipeByName(name, userId, exceptId) {
    return Recipe.findOne({
      where: {
        userId,
        ...(exceptId && { id: { [Op.ne]: exceptId } }),
        [Op.and]: where(fn('LOWER', fn('TRIM', col('name'))), name.trim().toLowerCase()),
      },
    });
  }
  async deleteRecipe(id) {
    if ((await Recipe.destroy({ where: { id } })) === 0) throw new Error('ID_NOT_EXISTING');
  }
  async updateRecipe(id, name, userId) {
    if (await this.showRecipeByName(name, userId, id)) throw new Error('RECIPE_EXISTS');
    return Recipe.update({ name }, { where: { id, userId } });
  }
}
export default new RecipeUser();
