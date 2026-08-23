import express from "express";
import { createUser, showUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/api/user/:id", showUser);

router.post("/api/user", createUser);

router.delete("/api/user/:id", deleteUser);

export default router;