import express from "express";
import { authDB, createDataBase } from "./config/data-base.js";
import routerUser from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.use(routerUser);

authDB();
createDataBase();


const port = 8080;
app.listen(port,(e) => {
    if(e) console.error("Ocorreu um erro ao iniciar o servidor");
    console.log("Servidor iniciado http://localhost:8080")
})