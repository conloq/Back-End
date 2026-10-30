// code-wiki:start
// Summary: Persiste e ordena as rampas de temperatura de uma receita.
// Description: A gravação recebe os valores já validados, junto do identificador da receita.
// A listagem ordena pela ordem da rampa e, em empate, pelo identificador.
// A listagem devolve todas as rampas da receita, sem paginação.
// O detalhe traz a receita junto, para o controller conferir o dono; a alteração devolve a rampa já gravada.
// code-wiki:end
import Temperature from '../models/temperatureModel.js';
import Recipe from '../models/recipeModel.js';

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

  async showOneTemperature(temperatureId) {
    const temperature = await Temperature.findByPk(temperatureId, { include: Recipe });
    return temperature;
  }

  async updateTemperature(temperatureId, dados) {
    await Temperature.update(dados, { where: { id: temperatureId } });
    const temperature = await Temperature.findByPk(temperatureId);
    return temperature;
  }

  async deleteTemperature(temperatureId) {
    await Temperature.destroy({ where: { id: temperatureId } });
  }
}

export default new TemperatureRecipe();
