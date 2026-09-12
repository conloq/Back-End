import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { showRecipe } from "../controllers/recipeController.js";

const Router = express.Router();

Router.get("/receitas", authMiddleware, showRecipe);

export default Router;