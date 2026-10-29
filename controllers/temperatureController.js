// code-wiki:start
// Summary: Cria e lista as rampas de temperatura da receita do usuário autenticado.
// Description: As temperaturas precisam ser inteiras de zero a cem graus, e a mínima não pode superar a máxima.
// Os horários seguem o formato de horas, minutos e segundos, e a ordem da rampa, quando vem, precisa caber em inteiro de 32 bits.
// A receita tem de existir e pertencer ao usuário; caso contrário a resposta é 404.
// A criação devolve a rampa gravada e a listagem devolve as rampas da receita.
// code-wiki:end
import TemperatureRecipe from '../services/temperatureService.js';
import RecipeUser from '../services/recipeService.js';

const createTemperature = async (req, res) => {
  try {
    const userId = req.userId;
    const recipeId = req.params.id;

    if (!/^[1-9][0-9]*$/.test(recipeId) || !Number.isSafeInteger(Number(recipeId)))
      return res.status(400).json({ error: 'ID inválido' });

    const recipe = await RecipeUser.showOneRecipe(recipeId);

    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });

    if (recipe.userId !== userId) return res.status(404).json({ error: 'Receita não encontrada' });

    const {
      maxTemperatureRamp,
      minTemperatureRamp,
      maxTemperatureLimit,
      minTemperatureLimit,
      timer,
      initialization,
      idealTime,
      orderRamp,
    } = req.body ?? {};

    const temperaturas = [
      maxTemperatureRamp,
      minTemperatureRamp,
      maxTemperatureLimit,
      minTemperatureLimit,
    ];

    for (const temperatura of temperaturas) {
      if (!Number.isInteger(temperatura) || temperatura < 0 || temperatura > 100)
        return res.status(400).json({ error: 'Temperaturas devem ser inteiras entre 0 e 100 °C' });
    }

    if (minTemperatureRamp > maxTemperatureRamp || minTemperatureLimit > maxTemperatureLimit)
      return res.status(400).json({ error: 'Temperatura mínima não pode superar a máxima' });

    // Horário no formato HH:MM:SS, ex: "01:30:00"
    const horarios = [timer, initialization, idealTime];

    for (const horario of horarios) {
      if (
        typeof horario !== 'string' ||
        !/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(horario)
      )
        return res.status(400).json({ error: 'Horários devem seguir HH:MM:SS' });
    }

    // orderRamp é opcional; se vier, tem que caber no INT do MySQL
    if (orderRamp !== undefined) {
      if (!Number.isInteger(orderRamp) || orderRamp < -2147483648 || orderRamp > 2147483647)
        return res.status(400).json({ error: 'Ordem da rampa deve ser um inteiro válido' });
    }

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
    const recipeId = req.params.id;

    if (!/^[1-9][0-9]*$/.test(recipeId) || !Number.isSafeInteger(Number(recipeId)))
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

export { createTemperature, showTemperature };
