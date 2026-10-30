// code-wiki:start
// Summary: Expõe a criação e a listagem de rampas por receita, e a alteração e exclusão por rampa.
// Description: Todas as rotas exigem token válido.
// Criação e listagem recebem o identificador da receita; alteração e exclusão recebem o da rampa.
// code-wiki:end
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createTemperature,
  deleteTemperature,
  showTemperature,
  updateTemperature,
} from '../controllers/temperatureController.js';
const router = express.Router();
router.post('/recipes/:id/temperatures', authMiddleware, createTemperature);
router.get('/recipes/:id/temperatures', authMiddleware, showTemperature);
router.put('/temperatures/:id', authMiddleware, updateTemperature);
router.delete('/temperatures/:id', authMiddleware, deleteTemperature);
export default router;
