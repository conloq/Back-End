// code-wiki:start
// Summary: Confere migrations e models em um banco MySQL de teste vazio.
// Description: Recusa schema existente, verifica nomes fisicos, FKs, timestamps, JSON camelCase e cascatas sem sync().
// code-wiki:end
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import mysql from 'mysql2/promise';
import 'dotenv/config';

assert.match(
  process.env.DB_DATABASE ?? '',
  /^mash_71_test_[a-z0-9_]+$/,
  'Use um banco vazio exclusivo com prefixo mash_71_test_',
);
const sql = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
let modelsConnection;
try {
  const [initial] = await sql.query('SHOW TABLES');
  assert.equal(initial.length, 0, 'O banco de teste precisa estar vazio; nada foi apagado');
  execFileSync('npm', ['run', 'db:migrate'], { stdio: 'inherit' });
  const expected = {
    users: ['id', 'name', 'email', 'phone', 'password', 'url_image', 'created_at', 'updated_at'],
    recipes: ['id', 'name', 'user_id', 'created_at', 'updated_at'],
    temperatures: [
      'id',
      'max_temperature_ramp',
      'min_temperature_ramp',
      'max_temperature_limit',
      'min_temperature_limit',
      'timer',
      'initialization',
      'ideal_time',
      'order_ramp',
      'recipe_id',
      'created_at',
      'updated_at',
    ],
    sessions: ['session_id', 'expires', 'data'],
  };
  const [columns] = await sql.query(
    'SELECT TABLE_NAME, COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME, ORDINAL_POSITION',
    [process.env.DB_DATABASE],
  );
  console.log('Schema observado:', JSON.stringify(columns));
  const [tables] = await sql.query('SHOW TABLES');
  assert.deepEqual(
    tables.map((row) => Object.values(row)[0]).sort(),
    ['SequelizeMeta', ...Object.keys(expected)].sort(),
  );
  for (const [table, names] of Object.entries(expected)) {
    assert.deepEqual(
      columns.filter((c) => c.TABLE_NAME === table).map((c) => c.COLUMN_NAME),
      names,
      table,
    );
    if (table !== 'sessions')
      for (const name of ['created_at', 'updated_at']) {
        assert.equal(
          columns.find((c) => c.TABLE_NAME === table && c.COLUMN_NAME === name).IS_NULLABLE,
          'NO',
        );
      }
  }
  assert.equal(
    columns.find((c) => c.TABLE_NAME === 'sessions' && c.COLUMN_NAME === 'session_id').DATA_TYPE,
    'varchar',
  );
  assert.match(
    columns.find((c) => c.TABLE_NAME === 'sessions' && c.COLUMN_NAME === 'expires').COLUMN_TYPE,
    /^int(?:\(10\))? unsigned$/,
  );
  assert.equal(
    columns.find((c) => c.TABLE_NAME === 'sessions' && c.COLUMN_NAME === 'data').DATA_TYPE,
    'mediumtext',
  );
  const [sessionIndexes] = await sql.query('SHOW INDEX FROM sessions');
  assert.ok(
    sessionIndexes.some(
      (index) => index.Key_name === 'PRIMARY' && index.Column_name === 'session_id',
    ),
  );
  const [keys] = await sql.query(
    `SELECT k.TABLE_NAME, k.COLUMN_NAME, k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME, r.DELETE_RULE, r.UPDATE_RULE
        FROM information_schema.KEY_COLUMN_USAGE k JOIN information_schema.REFERENTIAL_CONSTRAINTS r
        ON k.CONSTRAINT_SCHEMA=r.CONSTRAINT_SCHEMA AND k.TABLE_NAME=r.TABLE_NAME AND k.CONSTRAINT_NAME=r.CONSTRAINT_NAME
        WHERE k.TABLE_SCHEMA=? ORDER BY k.TABLE_NAME`,
    [process.env.DB_DATABASE],
  );
  assert.deepEqual(
    keys.map((k) => [
      k.TABLE_NAME,
      k.COLUMN_NAME,
      k.REFERENCED_TABLE_NAME,
      k.REFERENCED_COLUMN_NAME,
      k.DELETE_RULE,
      k.UPDATE_RULE,
    ]),
    [
      ['recipes', 'user_id', 'users', 'id', 'CASCADE', 'CASCADE'],
      ['temperatures', 'recipe_id', 'recipes', 'id', 'CASCADE', 'CASCADE'],
    ],
  );
  for (const key of keys) {
    assert.equal(
      columns.find((c) => c.TABLE_NAME === key.TABLE_NAME && c.COLUMN_NAME === key.COLUMN_NAME)
        .IS_NULLABLE,
      'NO',
    );
  }
  const { default: Connection } = await import('../config/sequelize-config.js');
  modelsConnection = Connection;
  await import('../config/associations.js');
  const { default: User } = await import('../models/userModel.js');
  const { default: Recipe } = await import('../models/recipeModel.js');
  const { default: Temperature } = await import('../models/temperatureModel.js');
  assert.equal(Connection.options.define.underscored, true);
  for (const [model, mapping] of [
    [User, { urlImage: 'url_image', createdAt: 'created_at', updatedAt: 'updated_at' }],
    [Recipe, { userId: 'user_id' }],
    [
      Temperature,
      {
        recipeId: 'recipe_id',
        maxTemperatureRamp: 'max_temperature_ramp',
        orderRamp: 'order_ramp',
      },
    ],
  ]) {
    for (const [attribute, column] of Object.entries(mapping))
      assert.equal(model.rawAttributes[attribute].field, column);
  }
  const user = await User.create({
    name: 'Schema test',
    email: 'schema@example.test',
    password: 'schema-test-only',
    phone: '11999990000',
    urlImage: null,
  });
  const recipe = await Recipe.create({ name: 'Schema recipe', userId: user.id });
  const temperature = await Temperature.create({
    recipeId: recipe.id,
    maxTemperatureRamp: 70,
    minTemperatureRamp: 60,
    maxTemperatureLimit: 80,
    minTemperatureLimit: 50,
    timer: '00:10:00',
    initialization: '00:00:00',
    idealTime: '00:05:00',
    orderRamp: 1,
  });
  assert.equal((await User.findByPk(user.id)).toJSON().phone, '11999990000');
  assert.equal(recipe.toJSON().userId, user.id);
  assert.equal(temperature.toJSON().recipeId, recipe.id);
  assert.ok(user.toJSON().createdAt instanceof Date);
  assert.equal(user.toJSON().urlImage, null);
  for (const entity of [user, recipe, temperature])
    assert.ok(Object.keys(entity.toJSON()).every((key) => !key.includes('_')));
  await assert.rejects(Recipe.create({ name: 'Invalid owner', userId: user.id + 10000 }), {
    name: 'SequelizeForeignKeyConstraintError',
  });
  await user.destroy();
  assert.equal(await Recipe.count(), 0);
  assert.equal(await Temperature.count(), 0);
  const [meta] = await sql.query('SELECT name FROM SequelizeMeta ORDER BY name');
  assert.equal(meta.length, 4);
  execFileSync('npm', ['run', 'db:migrate'], { stdio: 'inherit' });
  const [metaAgain] = await sql.query('SELECT name FROM SequelizeMeta ORDER BY name');
  assert.deepEqual(metaAgain, meta);
  const bootstrap = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(bootstrap, /Connection\s*\.\s*sync\s*\(/);
  console.log(
    'PASS: migrations do zero, sessões, nomes snake_case, FKs, timestamps, models/JSON camelCase, cascatas, reaplicacao sem mudancas e bootstrap sem sync().',
  );
} finally {
  if (modelsConnection) await modelsConnection.close();
  await sql.end();
}
