// code-wiki:start
// Summary: Persiste e ordena as rampas de temperatura de uma receita.
// Description: A gravação recebe os valores já validados, junto do identificador da receita.
// A listagem ordena pela ordem da rampa e, em empate, pelo identificador.
// A listagem devolve todas as rampas da receita, sem paginação.
// code-wiki:end
import Temperature from '../models/temperatureModel.js';

class TemperatureRecipe {
  async createTemperature(
    maxTemperatureRamp,
    minTemperatureRamp,
    maxTemperatureLimit,
    minTemperatureLimit,
    timer,
    initialization,
    idealTime,
    orderRamp,
    recipeId,
  ) {
    const temperature = await Temperature.create({
      maxTemperatureRamp,
      minTemperatureRamp,
      maxTemperatureLimit,
      minTemperatureLimit,
      timer,
      initialization,
      idealTime,
      orderRamp,
      recipeId,
    });
    return temperature;
  }

  async showTemperature(recipeId) {
    const temperatures = await Temperature.findAll({
      where: { recipeId: recipeId },
      order: [
        ['orderRamp', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    return temperatures;
  }
}

export default new TemperatureRecipe();
