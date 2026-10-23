// code-wiki:start
// Summary: Persiste e ordena rampas pelos atributos de Temperature.
// Description: Guarda orderRamp e recipeId, sem activeTemperature ou traducao de campos.
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
