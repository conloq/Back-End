// code-wiki:start
// Summary: Persiste e ordena as rampas de temperatura de uma receita.
// Description: A gravação recebe os valores já validados, junto do identificador da receita.
// A listagem ordena pela ordem da rampa e, em empate, pelo identificador.
// A listagem devolve todas as rampas da receita, sem paginação.
// code-wiki:end
import Temperature from '../models/temperatureModel.js';
class TemperatureRecipe {
  async createTemperature(values) {
    return Temperature.create(values);
  }
  async showTemperature(recipeId) {
    return Temperature.findAll({
      where: { recipeId },
      order: [
        ['orderRamp', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  }
}
export default new TemperatureRecipe();
