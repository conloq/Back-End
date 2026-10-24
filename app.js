import express from 'express';
import 'dotenv/config';

const obrigatorias = [
  'DB_HOST',
  'DB_USERNAME',
  'DB_DATABASE',
  'JWT_SECRET_KEY',
  'CLOUD_NAME',
  'API_KEY_CLOUDINARY',
  'API_SECRET_KEY_CLOUDINARY',
];
const ausentes = obrigatorias.filter((nome) => !process.env[nome]);
if (ausentes.length) {
  console.error(`Variáveis de ambiente ausentes: ${ausentes.join(', ')}`);
  process.exit(1);
}

import { authDB } from './config/data-base.js';
import RouterUser from './routes/userRoutes.js';
import RouterRecipe from './routes/recipeRoutes.js';
import RouterTemperature from './routes/temperatureRoutes.js';
import RouterSwagger from './routes/swaggerRoutes.js';
import './config/associations.js';

authDB();

const app = express();

app.get('/health', (req, res) => res.status(200).json({ message: 'ok' }));

// CORS: libera o frontend (porta 4000) a chamar a API direto do navegador
const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4000';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', frontendUrl);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight: o navegador pergunta antes de enviar Authorization/JSON
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.use(RouterUser);
app.use(RouterRecipe);
app.use(RouterSwagger);
app.use(RouterTemperature);

const port = Number(process.env.PORT || 8080);
app.listen(port, (e) => {
  if (e) console.error('Ocorreu um erro ao iniciar o servidor');
  console.log(`Servidor iniciado http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/api-docs`);
});
