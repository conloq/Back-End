// code-wiki: Expõe cadastro, login e operações do perfil autenticado.
import express from "express";
import { rateLimit } from "express-rate-limit";
import { createUser, showUser, deleteUser, updateUser, updateImage } from "../controllers/userController.js";
import login from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadUserImage } from "../middlewares/multer.js";

const router = express.Router();
// Limite local por conta autenticada, independente de proxy/IP compartilhado.
const uploadRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    keyGenerator: (req) => String(req.userId),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Limite de envio de imagens atingido; tente novamente em um minuto" }
});

router.post("/login", login);
router.post("/user", createUser);

router.get("/user", authMiddleware, showUser);
router.delete("/user", authMiddleware, deleteUser);
router.put("/user", authMiddleware, updateUser);

router.put("/user/upload", authMiddleware, uploadRateLimit, uploadUserImage, updateImage);

export default router;