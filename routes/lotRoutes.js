// code-wiki:start
// Summary: Expõe o CRUD de lotes do usuário autenticado.
// Description: Listagem e criação respondem pela coleção de lotes; detalhe, alteração e exclusão recebem o identificador na URL.
// Todas exigem token válido, e nenhuma aceita o usuário pelo corpo da requisição.
// code-wiki:end
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createLot,
  deleteLot,
  showLots,
  showOneLot,
  updateLot,
} from '../controllers/lotController.js';
const router = express.Router();
router.get('/lots', authMiddleware, showLots);
router.post('/lots', authMiddleware, createLot);
router.get('/lots/:id', authMiddleware, showOneLot);
router.put('/lots/:id', authMiddleware, updateLot);
router.delete('/lots/:id', authMiddleware, deleteLot);
export default router;
