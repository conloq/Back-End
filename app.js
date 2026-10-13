import express from "express";
import "dotenv/config";
import { authDB } from "./config/data-base.js";
import RouterUser from "./routes/userRoutes.js";
import RouterRecipe from "./routes/recipeRoutes.js";
import RouterTemperature from "./routes/temperatureRoutes.js";
import RouterSwagger from "./routes/swaggerRoutes.js";
import Connection from "./config/sequelize-config.js";
import "./config/associations.js";

authDB();

const app = express();
app.use(express.json());

// CORS: libera o frontend (porta 4000) a chamar a API direto do navegador
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:4000";
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", frontendUrl);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Preflight: o navegador pergunta antes de enviar Authorization/JSON
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.use(RouterUser);
app.use(RouterRecipe);
app.use(RouterSwagger);
app.use(RouterTemperature);

await Connection.sync();

const port = 8080;
app.listen(port,(e) => {
    if(e) console.error("Ocorreu um erro ao iniciar o servidor");
    console.log(`Servidor iniciado http://localhost:${port}`);
    console.log(`Documentação Swagger em http://localhost:${port}/api-docs`)
});