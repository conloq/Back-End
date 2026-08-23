import express from "express";
import { createUser, showUser, deleteUser } from "../controllers/userController.js";
import login from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/api/login", login);
router.post("/api/user", createUser);

router.get("/api/user", authMiddleware, showUser);
router.delete("/api/user", authMiddleware, deleteUser);

export default router;