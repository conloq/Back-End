// code-wiki:start
// Summary: Expõe as receitas em inglês, com o identificador na URL nas operações de um item.
// Description: Listagem e criação respondem pela coleção de receitas; detalhe, alteração e exclusão recebem o identificador na URL.
// Todas exigem token válido, e nenhuma delas aceita o usuário pelo corpo da requisição.
// As rotas seguem o padrão de nome em inglês minúsculo e plural do contrato do projeto.
// code-wiki:end
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createRecipe,
  deleteRecipe,
  showRecipe,
  showOneRecipe,
  updateRecipe,
} from '../controllers/recipeController.js';
const router = express.Router();
router.get('/recipes', authMiddleware, showRecipe);
router.post('/recipes', authMiddleware, createRecipe);
router.get('/recipes/:id', authMiddleware, showOneRecipe);
router.delete('/recipes/:id', authMiddleware, deleteRecipe);
router.put('/recipes/:id', authMiddleware, updateRecipe);
export default router;
