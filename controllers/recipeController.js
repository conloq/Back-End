// code-wiki:start
// Summary: Valida receitas e responde com os envelopes do contrato.
// Description: O identificador da URL precisa ser inteiro positivo, e o nome não pode ser vazio nem passar de 255 caracteres.
// Recurso ausente e recurso de outro usuário respondem o mesmo 404, sem revelar a existência do dado alheio.
// A criação devolve a receita gravada; a alteração devolve só a mensagem de sucesso.
// A exclusão responde 204 sem corpo, e o 409 de receita com lote vinculado depende do model de lote, que ainda não existe.
// Nome repetido do mesmo usuário responde 409, e qualquer outra falha vira 500.
// code-wiki:end
import RecipeUser from '../services/recipeService.js';
export const validId = (value) =>
  typeof value === 'string' && /^[1-9][0-9]*$/.test(value) && Number.isSafeInteger(Number(value));
const validName = (value) =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 255;
const failure = (res, error) =>
  error.message === 'RECIPE_EXISTS'
    ? res.status(409).json({ error: 'Receita já existe' })
    : res.status(500).json({ error: 'Erro interno do servidor' });
const showRecipe = async (req, res) => {
  try {
    return res.status(200).json({ recipes: await RecipeUser.showRecipes(req.userId) });
  } catch (error) {
    return failure(res, error);
  }
};
const showOneRecipe = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const recipe = await RecipeUser.showOneRecipe(req.params.id);
    if (!recipe || recipe.userId !== req.userId)
      return res.status(404).json({ error: 'Receita não encontrada' });
    return res.status(200).json({ recipe });
  } catch (error) {
    return failure(res, error);
  }
};
const createRecipe = async (req, res) => {
  if (!validName(req.body?.name))
    return res.status(400).json({
      error:
        typeof req.body?.name === 'string' && req.body.name.trim().length > 255
          ? 'Nome não pode exceder 255 caracteres'
          : 'Nome não pode estar vazio',
    });
  try {
    const recipe = await RecipeUser.createRecipe(req.body.name.trim(), req.userId);
    return res.status(201).json({ message: 'Receita criada com sucesso', recipe });
  } catch (error) {
    return failure(res, error);
  }
};
// O 409 "Receita possui lotes vinculados" depende do model de lote (#31).
const deleteRecipe = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const recipe = await RecipeUser.showOneRecipe(req.params.id);
    if (!recipe || recipe.userId !== req.userId)
      return res.status(404).json({ error: 'Receita não encontrada' });
    await RecipeUser.deleteRecipe(req.params.id);
    return res.sendStatus(204);
  } catch (error) {
    return failure(res, error);
  }
};
const updateRecipe = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  if (!validName(req.body?.name))
    return res.status(400).json({ error: 'Nome não pode estar vazio ou exceder 255 caracteres' });
  try {
    const recipe = await RecipeUser.showOneRecipe(req.params.id);
    if (!recipe || recipe.userId !== req.userId)
      return res.status(404).json({ error: 'Receita não encontrada' });
    await RecipeUser.updateRecipe(req.params.id, req.body.name.trim(), req.userId);
    return res.status(200).json({ message: 'Receita atualizada com sucesso' });
  } catch (error) {
    return failure(res, error);
  }
};
export { showRecipe, createRecipe, deleteRecipe, updateRecipe, showOneRecipe };
