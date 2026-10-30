// code-wiki:start
// Summary: Valida lotes e responde com os envelopes do contrato.
// Description: O identificador da URL precisa ser inteiro positivo; o nome não pode ser vazio nem passar de 255 caracteres, e a receita precisa ser um inteiro positivo.
// O início da mosturação, quando vem, precisa ser data válida, e o estado só aceita ativo ou concluído.
// A receita precisa ser do próprio usuário, e lote ausente ou de outro usuário responde o mesmo 404.
// A criação devolve o lote gravado, a alteração só a mensagem e a exclusão responde 204 sem corpo.
// code-wiki:end
import LotService from '../services/lotService.js';
import RecipeUser from '../services/recipeService.js';

// Devolve a mensagem de erro do corpo, ou null quando está válido
const validarLote = (body) => {
  const { name, recipeId, mashStart, status } = body;

  if (typeof name !== 'string' || !name.trim() || name.trim().length > 255)
    return 'Nome não pode estar vazio ou exceder 255 caracteres';

  if (!Number.isSafeInteger(recipeId) || recipeId <= 0) return 'Receita deve ser um ID inteiro';

  if (mashStart !== undefined && (typeof mashStart !== 'string' || isNaN(Date.parse(mashStart))))
    return 'Início da mosturação deve ser uma data válida';

  if (status !== undefined && status !== 'active' && status !== 'completed')
    return 'Status deve ser active ou completed';

  return null;
};

const createLot = async (req, res) => {
  try {
    const userId = req.userId;
    const body = req.body ?? {};

    const erro = validarLote(body);
    if (erro) return res.status(400).json({ error: erro });

    const recipe = await RecipeUser.showOneRecipe(body.recipeId);

    if (!recipe || recipe.userId !== userId)
      return res.status(404).json({ error: 'Receita não encontrada' });

    const lot = await LotService.createLot({
      name: body.name.trim(),
      userId: userId,
      recipeId: body.recipeId,
      mashStart: body.mashStart,
      status: body.status,
    });

    return res.status(201).json({ message: 'Lote criado com sucesso', lot });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const showLots = async (req, res) => {
  try {
    const lots = await LotService.showLots(req.userId);

    return res.status(200).json({ lots });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const showOneLot = async (req, res) => {
  try {
    const lotId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(lotId) || lotId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const lot = await LotService.showOneLot(lotId);

    // Lote de outro usuário responde igual a inexistente, para não revelar que ele existe
    if (!lot || lot.userId !== req.userId)
      return res.status(404).json({ error: 'Lote não encontrado' });

    return res.status(200).json({ lot });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateLot = async (req, res) => {
  try {
    const userId = req.userId;
    const lotId = Number(req.params.id);
    const body = req.body ?? {};

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(lotId) || lotId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const erro = validarLote(body);
    if (erro) return res.status(400).json({ error: erro });

    const lot = await LotService.showOneLot(lotId);

    if (!lot || lot.userId !== userId)
      return res.status(404).json({ error: 'Lote não encontrado' });

    const recipe = await RecipeUser.showOneRecipe(body.recipeId);

    if (!recipe || recipe.userId !== userId)
      return res.status(404).json({ error: 'Receita não encontrada' });

    // mashStart e status ausentes mantêm o valor gravado
    await LotService.updateLot(lotId, {
      name: body.name.trim(),
      recipeId: body.recipeId,
      ...(body.mashStart !== undefined && { mashStart: body.mashStart }),
      ...(body.status !== undefined && { status: body.status }),
    });

    return res.status(200).json({ message: 'Lote atualizado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteLot = async (req, res) => {
  try {
    const lotId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(lotId) || lotId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const lot = await LotService.showOneLot(lotId);

    if (!lot || lot.userId !== req.userId)
      return res.status(404).json({ error: 'Lote não encontrado' });

    await LotService.deleteLot(lotId);

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export { createLot, showLots, showOneLot, updateLot, deleteLot };
