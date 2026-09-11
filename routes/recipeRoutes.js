import express from "express";
import router from "./userRoutes";
import authMiddleware from "../middlewares/authMiddleware.js";
import { showRecipe } from "../controllers/recipeController.js";

const Router = express.Router();

router.get("/receitas", authMiddleware, showRecipe);