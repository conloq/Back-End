// code-wiki:start
// Summary: Valida receitas e responde com os envelopes do contrato.
// Description: O identificador da URL precisa ser inteiro positivo, e o nome não pode ser vazio nem passar de 255 caracteres.
// Recurso ausente e recurso de outro usuário respondem o mesmo 404, sem revelar a existência do dado alheio.
// A criação devolve a receita gravada; a alteração devolve só a mensagem de sucesso.
// A exclusão responde 204 sem corpo, e o 409 de receita com lote vinculado depende do model de lote, que ainda não existe.
// Nome repetido do mesmo usuário responde 409, e qualquer outra falha vira 500.
// code-wiki:end
import RecipeUser from '../services/recipeService.js';

const showRecipe = async (req, res) => {
  try {
    const userId = req.userId;

    const recipes = await RecipeUser.showRecipes(userId);

    return res.status(200).json({ recipes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const showOneRecipe = async (req, res) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(recipeId) || recipeId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const recipe = await RecipeUser.showOneRecipe(recipeId);

    // Receita de outro usuário responde igual a inexistente, para não revelar que ela existe
    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });

    console.log(recipe);

    if (recipe.userId !== userId) return res.status(404).json({ error: 'Receita não encontrada' });

    return res.status(200).json({ recipe });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createRecipe = async (req, res) => {
  try {
    const userId = req.userId;
    const nameRecipe = req.body?.name;

    if (typeof nameRecipe !== 'string' || !nameRecipe.trim())
      return res.status(400).json({ error: 'Nome não pode estar vazio' });

    const cleanName = nameRecipe.trim();

    if (cleanName.length > 255)
      return res.status(400).json({ error: 'Nome não pode exceder 255 caracteres' });

    const existsRecipe = await RecipeUser.showRecipeByName(cleanName, userId);
    console.log(existsRecipe);

    if (existsRecipe) return res.status(409).json({ error: 'Receita já existe' });

    const recipe = await RecipeUser.createRecipe(cleanName, userId);

    return res.status(201).json({ message: 'Receita criada com sucesso', recipe });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// O 409 "Receita possui lotes vinculados" depende do model de lote (#31).
const deleteRecipe = async (req, res) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(recipeId) || recipeId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const recipe = await RecipeUser.showOneRecipe(recipeId);

    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });

    console.log(recipe);

    if (recipe.userId !== userId) return res.status(404).json({ error: 'Receita não encontrada' });

    await RecipeUser.deleteRecipe(recipeId);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.id);
    const nameRecipe = req.body?.name;

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(recipeId) || recipeId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    if (typeof nameRecipe !== 'string' || !nameRecipe.trim() || nameRecipe.trim().length > 255)
      return res.status(400).json({ error: 'Nome não pode estar vazio ou exceder 255 caracteres' });

    const cleanName = nameRecipe.trim();

    const recipe = await RecipeUser.showOneRecipe(recipeId);

    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });

    if (recipe.userId !== userId) return res.status(404).json({ error: 'Receita não encontrada' });

    // Procura outra receita do usuário com o mesmo nome, ignorando a própria
    const existsRecipe = await RecipeUser.showRecipeByName(cleanName, userId, recipeId);

    if (existsRecipe) return res.status(409).json({ error: 'Receita já existe' });

    await RecipeUser.updateRecipe(recipeId, cleanName, userId);

    return res.status(200).json({ message: 'Receita atualizada com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export { showRecipe, createRecipe, deleteRecipe, updateRecipe, showOneRecipe };
