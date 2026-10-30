// code-wiki:start
// Summary: Cria, lista, altera e exclui as rampas de temperatura da receita do usuário autenticado.
// Description: As temperaturas precisam ser inteiras de zero a cem graus, e a mínima não pode superar a máxima.
// Os horários seguem o formato de horas, minutos e segundos, e a ordem da rampa, quando vem, precisa caber em inteiro de 32 bits.
// A receita tem de existir e pertencer ao usuário; caso contrário a resposta é 404.
// A criação e a alteração devolvem a rampa gravada, a listagem devolve as rampas da receita e a exclusão responde 204.
// Rampa ausente ou de receita de outro usuário responde o mesmo 404.
// code-wiki:end
import TemperatureRecipe from '../services/temperatureService.js';
import RecipeUser from '../services/recipeService.js';

// Devolve a mensagem de erro do corpo da rampa, ou null quando está válido
const validarRampa = (body) => {
  const {
    maxTemperatureRamp,
    minTemperatureRamp,
    maxTemperatureLimit,
    minTemperatureLimit,
    timer,
    initialization,
    idealTime,
    orderRamp,
  } = body;

  const temperaturas = [
    maxTemperatureRamp,
    minTemperatureRamp,
    maxTemperatureLimit,
    minTemperatureLimit,
  ];

  for (const temperatura of temperaturas) {
    if (!Number.isInteger(temperatura) || temperatura < 0 || temperatura > 100)
      return 'Temperaturas devem ser inteiras entre 0 e 100 °C';
  }

  if (minTemperatureRamp > maxTemperatureRamp || minTemperatureLimit > maxTemperatureLimit)
    return 'Temperatura mínima não pode superar a máxima';

  // Horário no formato HH:MM:SS, ex: "01:30:00"
  const horarios = [timer, initialization, idealTime];

  for (const horario of horarios) {
    if (typeof horario !== 'string' || !/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(horario))
      return 'Horários devem seguir HH:MM:SS';
  }

  // orderRamp é opcional; se vier, tem que caber no INT do MySQL
  if (orderRamp !== undefined) {
    if (!Number.isInteger(orderRamp) || orderRamp < -2147483648 || orderRamp > 2147483647)
      return 'Ordem da rampa deve ser um inteiro válido';
  }

  return null;
};

const createTemperature = async (req, res) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(recipeId) || recipeId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const recipe = await RecipeUser.showOneRecipe(recipeId);

    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });

    if (recipe.userId !== userId) return res.status(404).json({ error: 'Receita não encontrada' });

    const body = req.body ?? {};

    const erro = validarRampa(body);
    if (erro) return res.status(400).json({ error: erro });

    const {
      maxTemperatureRamp,
      minTemperatureRamp,
      maxTemperatureLimit,
      minTemperatureLimit,
      timer,
      initialization,
      idealTime,
      orderRamp,
    } = body;

    const temperature = await TemperatureRecipe.createTemperature(
      maxTemperatureRamp,
      minTemperatureRamp,
      maxTemperatureLimit,
      minTemperatureLimit,
      timer,
      initialization,
      idealTime,
      orderRamp,
      recipe.id,
    );

    return res.status(201).json({ message: 'Temperatura criada com sucesso', temperature });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const showTemperature = async (req, res) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(recipeId) || recipeId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const recipe = await RecipeUser.showOneRecipe(recipeId);

    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });

    if (recipe.userId !== userId) return res.status(404).json({ error: 'Receita não encontrada' });

    const temperatures = await TemperatureRecipe.showTemperature(recipe.id);

    return res.status(200).json({ temperatures: temperatures });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Busca a rampa e confere se a receita dela é do usuário; null quando não pode ser usada
const buscarRampaDoUsuario = async (temperatureId, userId) => {
  const temperature = await TemperatureRecipe.showOneTemperature(temperatureId);

  if (!temperature || temperature.recipe.userId !== userId) return null;

  return temperature;
};

const updateTemperature = async (req, res) => {
  try {
    const temperatureId = Number(req.params.id);
    const body = req.body ?? {};

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(temperatureId) || temperatureId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const erro = validarRampa(body);
    if (erro) return res.status(400).json({ error: erro });

    if (!(await buscarRampaDoUsuario(temperatureId, req.userId)))
      return res.status(404).json({ error: 'Rampa não encontrada' });

    const temperature = await TemperatureRecipe.updateTemperature(temperatureId, {
      maxTemperatureRamp: body.maxTemperatureRamp,
      minTemperatureRamp: body.minTemperatureRamp,
      maxTemperatureLimit: body.maxTemperatureLimit,
      minTemperatureLimit: body.minTemperatureLimit,
      timer: body.timer,
      initialization: body.initialization,
      idealTime: body.idealTime,
      orderRamp: body.orderRamp ?? null,
    });

    return res.status(200).json({ message: 'Rampa atualizada com sucesso', temperature });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteTemperature = async (req, res) => {
  try {
    const temperatureId = Number(req.params.id);

    // ID vem da URL; sem isso, "1abc" viraria 1 no MySQL
    if (!Number.isSafeInteger(temperatureId) || temperatureId <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    if (!(await buscarRampaDoUsuario(temperatureId, req.userId)))
      return res.status(404).json({ error: 'Rampa não encontrada' });

    await TemperatureRecipe.deleteTemperature(temperatureId);

    return res.sendStatus(204);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export { createTemperature, showTemperature, updateTemperature, deleteTemperature };
