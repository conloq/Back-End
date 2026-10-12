import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createTemperature, showTemperature } from "../controllers/temperatureController.js";
const router = express.Router();

router.post("/receitas/temperatura/:id", authMiddleware, createTemperature);
router.get("/receitas/temperatura/:id", authMiddleware, showTemperature);
// router.delete("/temperatura", authMiddleware, deleteUser);
// router.put("/temperatura", authMiddleware, updateUser);

export default router;