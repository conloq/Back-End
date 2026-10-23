// code-wiki:start
// Summary: Expoe receitas em ingles com parametro id.
// Description: Protege criacao, lista, detalhe e operacoes existentes por JWT.
// code-wiki:end
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createRecipe, deleteRecipe, showRecipe, showOneRecipe, updateRecipe } from "../controllers/recipeController.js";
const router = express.Router();
router.get("/recipes", authMiddleware, showRecipe);
router.post("/recipes", authMiddleware, createRecipe);
router.get("/recipes/:id", authMiddleware, showOneRecipe);
router.delete("/recipes/:id", authMiddleware, deleteRecipe);
router.put("/recipes/:id", authMiddleware, updateRecipe);
export default router;
