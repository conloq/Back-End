// code-wiki:start
// Summary: Expoe criacao e lista de rampas por receita.
// Description: As duas rotas usam JWT e o parametro generico id da receita.
// code-wiki:end
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createTemperature, showTemperature } from '../controllers/temperatureController.js';
const router = express.Router();
router.post('/recipes/:id/temperatures', authMiddleware, createTemperature);
router.get('/recipes/:id/temperatures', authMiddleware, showTemperature);
export default router;
