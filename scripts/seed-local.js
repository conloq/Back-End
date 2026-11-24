// Seed de desenvolvimento local: usuário de teste, receitas com rampas e lotes.
// Idempotente: pode rodar várias vezes; recria os dados só do usuário de teste.
// Uso: npm run db:seed  (depois de npm run db:migrate)
import 'dotenv/config';
import Connection from '../config/sequelize-config.js';
import '../config/associations.js';
import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js';
import Temperature from '../models/temperatureModel.js';
import Lot from '../models/lotModel.js';
import { createHash } from '../services/argon2.js';

const EMAIL = 'teste@teste.com';
const SENHA = '123';

const receitas = [
  {
    name: 'American IPA',
    rampas: [
      { min: 50, max: 52, minLim: 48, maxLim: 54, timer: '00:15:00', ideal: '00:15:00' },
      { min: 64, max: 66, minLim: 62, maxLim: 68, timer: '00:60:00', ideal: '01:00:00' },
      { min: 76, max: 78, minLim: 75, maxLim: 80, timer: '00:10:00', ideal: '00:10:00' },
    ],
  },
  {
    name: 'Pilsen Clássica',
    rampas: [
      { min: 52, max: 54, minLim: 50, maxLim: 56, timer: '00:20:00', ideal: '00:20:00' },
      { min: 62, max: 64, minLim: 60, maxLim: 66, timer: '00:40:00', ideal: '00:40:00' },
      { min: 71, max: 73, minLim: 69, maxLim: 75, timer: '00:20:00', ideal: '00:20:00' },
      { min: 76, max: 78, minLim: 75, maxLim: 80, timer: '00:10:00', ideal: '00:10:00' },
    ],
  },
  {
    name: 'Weiss de Trigo',
    rampas: [
      { min: 44, max: 46, minLim: 42, maxLim: 48, timer: '00:15:00', ideal: '00:15:00' },
      { min: 66, max: 68, minLim: 64, maxLim: 70, timer: '00:50:00', ideal: '00:50:00' },
      { min: 76, max: 78, minLim: 75, maxLim: 80, timer: '00:10:00', ideal: '00:10:00' },
    ],
  },
];

const lotes = [
  { name: 'Lote 001 - IPA', receita: 'American IPA', diasAtras: 20, status: 'completed' },
  { name: 'Lote 002 - Pilsen', receita: 'Pilsen Clássica', diasAtras: 7, status: 'completed' },
  { name: 'Lote 003 - IPA', receita: 'American IPA', diasAtras: 0, status: 'active' },
  { name: 'Lote 004 - Weiss', receita: 'Weiss de Trigo', diasAtras: 1, status: 'active' },
];

// 'HH:60:00' não é válido; normaliza minutos > 59
function hhmmss(t) {
  const [h, m, s] = t.split(':').map(Number);
  const total = h * 3600 + m * 60 + s;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

async function main() {
  // Opt-in explícito: sem NODE_ENV=development (ex.: banco publicado) o seed não roda
  if (process.env.NODE_ENV !== 'development') {
    console.error('Seed bloqueado: defina NODE_ENV=development no .env local para rodar.');
    process.exitCode = 1;
    await Connection.close();
    return;
  }
  await Connection.authenticate();
  const t = await Connection.transaction();
  try {
    const existente = await User.findOne({ where: { email: EMAIL }, transaction: t });
    if (existente) await existente.destroy({ transaction: t }); // CASCADE limpa receitas, rampas e lotes

    const user = await User.create(
      { name: 'Usuário Teste', email: EMAIL, phone: null, password: await createHash(SENHA) },
      { transaction: t },
    );

    const porNome = {};
    for (const r of receitas) {
      const recipe = await Recipe.create({ name: r.name, userId: user.id }, { transaction: t });
      porNome[r.name] = recipe;
      for (const [i, p] of r.rampas.entries()) {
        await Temperature.create(
          {
            recipeId: recipe.id,
            minTemperatureRamp: p.min,
            maxTemperatureRamp: p.max,
            minTemperatureLimit: p.minLim,
            maxTemperatureLimit: p.maxLim,
            timer: hhmmss(p.timer),
            initialization: '00:00:00',
            idealTime: hhmmss(p.ideal),
            orderRamp: i + 1,
          },
          { transaction: t },
        );
      }
    }

    for (const l of lotes) {
      const mashStart = new Date(Date.now() - l.diasAtras * 86400000);
      await Lot.create(
        {
          name: l.name,
          userId: user.id,
          recipeId: porNome[l.receita].id,
          mashStart,
          status: l.status,
        },
        { transaction: t },
      );
    }

    await t.commit();
    console.log(
      `Seed ok: ${EMAIL} / ${SENHA} — ${receitas.length} receitas, ${lotes.length} lotes.`,
    );
  } catch (err) {
    await t.rollback();
    throw err;
  } finally {
    await Connection.close();
  }
}

main().catch((err) => {
  console.error('Falha no seed:', err.message);
  process.exit(1);
});
