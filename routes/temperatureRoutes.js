// code-wiki:start
// Summary: Expõe a criação e a listagem de rampas por receita.
// Description: As duas rotas recebem o identificador da receita na URL e exigem token válido.
// A criação devolve a rampa gravada e a listagem devolve as rampas daquela receita; não há alteração nem exclusão neste conjunto.
// code-wiki:end
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createTemperature, showTemperature } from '../controllers/temperatureController.js';
const router = express.Router();
router.post('/recipes/:id/temperatures', authMiddleware, createTemperature);
router.get('/recipes/:id/temperatures', authMiddleware, showTemperature);
export default router;
