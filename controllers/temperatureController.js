// code-wiki:start
// Summary: Cria e lista as rampas de temperatura da receita do usuário autenticado.
// Description: As temperaturas precisam ser inteiras de zero a cem graus, e a mínima não pode superar a máxima.
// Os horários seguem o formato de horas, minutos e segundos, e a ordem da rampa, quando vem, precisa caber em inteiro de 32 bits.
// A receita tem de existir e pertencer ao usuário; caso contrário a resposta é 404.
// A criação devolve a rampa gravada e a listagem devolve as rampas da receita.
// code-wiki:end
import TemperatureRecipe from '../services/temperatureService.js';
import RecipeUser from '../services/recipeService.js';
import { validId } from './recipeController.js';
const temperatures = [
  'maxTemperatureRamp',
  'minTemperatureRamp',
  'maxTemperatureLimit',
  'minTemperatureLimit',
];
const times = ['timer', 'initialization', 'idealTime'];
const timePattern = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
const createTemperature = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const recipe = await RecipeUser.showOneRecipe(req.params.id);
    if (!recipe || recipe.userId !== req.userId)
      return res.status(404).json({ error: 'Receita não encontrada' });
    const body = req.body ?? {};
    if (
      temperatures.some((key) => !Number.isInteger(body[key]) || body[key] < 0 || body[key] > 100)
    )
      return res.status(400).json({ error: 'Temperaturas devem ser inteiras entre 0 e 100 °C' });
    if (
      body.minTemperatureRamp > body.maxTemperatureRamp ||
      body.minTemperatureLimit > body.maxTemperatureLimit
    )
      return res.status(400).json({ error: 'Temperatura mínima não pode superar a máxima' });
    if (times.some((key) => typeof body[key] !== 'string' || !timePattern.test(body[key])))
      return res.status(400).json({ error: 'Horários devem seguir HH:MM:SS' });
    if (
      body.orderRamp !== undefined &&
      (!Number.isInteger(body.orderRamp) ||
        body.orderRamp < -2147483648 ||
        body.orderRamp > 2147483647)
    )
      return res.status(400).json({ error: 'Ordem da rampa deve ser um inteiro válido' });
    const values = Object.fromEntries([...temperatures, ...times].map((key) => [key, body[key]]));
    if (body.orderRamp !== undefined) values.orderRamp = body.orderRamp;
    const temperature = await TemperatureRecipe.createTemperature({
      ...values,
      recipeId: recipe.id,
    });
    return res.status(201).json({ message: 'Temperatura criada com sucesso', temperature });
  } catch {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
const showTemperature = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const recipe = await RecipeUser.showOneRecipe(req.params.id);
    if (!recipe || recipe.userId !== req.userId)
      return res.status(404).json({ error: 'Receita não encontrada' });
    return res
      .status(200)
      .json({ temperatures: await TemperatureRecipe.showTemperature(recipe.id) });
  } catch {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
export { createTemperature, showTemperature };
