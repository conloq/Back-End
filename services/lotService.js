// code-wiki:start
// Summary: Persiste os lotes do usuário.
// Description: A lista sai por identificador crescente e filtrada pelo dono; o detalhe busca pela chave primária, sem filtro de dono.
// A alteração grava só os campos recebidos, e a exclusão remove pela chave primária.
// code-wiki:end
import Lot from '../models/lotModel.js';

class LotService {
  async createLot(dados) {
    const lot = await Lot.create(dados);
    return lot;
  }

  async showLots(userId) {
    const lots = await Lot.findAll({
      where: { userId: userId },
      order: [['id', 'ASC']],
    });
    return lots;
  }

  async showOneLot(lotId) {
    const lot = await Lot.findByPk(lotId);
    return lot;
  }

  async countLotsByRecipe(recipeId) {
    const total = await Lot.count({ where: { recipeId: recipeId } });
    return total;
  }

  async updateLot(lotId, dados) {
    const update = await Lot.update(dados, { where: { id: lotId } });
    return update;
  }

  async deleteLot(lotId) {
    await Lot.destroy({ where: { id: lotId } });
  }
}

export default new LotService();
