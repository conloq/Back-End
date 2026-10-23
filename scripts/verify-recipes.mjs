// code-wiki:start
// Summary: Confere o contrato HTTP de receitas e rampas em API descartavel.
// Description: Cria duas contas sinteticas, valida limites e isolamento e remove apenas as proprias contas.
// code-wiki:end
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const base = process.env.RECIPE_TEST_BASE;
assert.equal(base, 'http://127.0.0.1:8080', 'Use uma API local descartável');
const tokens = [];
let checks = 0;
async function call(method, path, body, token, expected) {
  const r = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (expected !== undefined) {
    assert.equal(r.status, expected, `${method} ${path}: ${text}`);
    checks++;
  }
  if (r.status >= 400) {
    assert.equal(typeof data.error, 'string');
    assert.deepEqual(Object.keys(data), ['error']);
  }
  return data;
}
const name = `Recipes ${Date.now()}`;
try {
  for (let i = 0; i < 2; i++) {
    const email = `recipes-${Date.now()}-${i}@example.test`;
    await call(
      'POST',
      '/user',
      { name: 'Recipe test', email, password: 'Test-only-recipe-password' },
      null,
      201,
    );
    const login = await call(
      'POST',
      '/login',
      { email, password: 'Test-only-recipe-password' },
      null,
      200,
    );
    tokens.push(login.token);
  }
  const [owner, other] = tokens;
  assert.deepEqual(await call('GET', '/recipes', undefined, owner, 200), { recipes: [] });
  for (const value of [undefined, '', '   ', 4, null, {}, 'a'.repeat(256)])
    await call('POST', '/recipes', { name: value }, owner, 400);
  const created = await call('POST', '/recipes', { name: `  ${name}  `, userId: 999 }, owner, 201);
  const id = created.recipe.id;
  assert.equal(created.recipe.name, name);
  assert.equal(created.message, 'Receita criada com sucesso');
  assert.ok(created.recipe.userId);
  assert.notEqual(created.recipe.userId, 999);
  assert.ok(created.recipe.createdAt);
  assert.ok(created.recipe.updatedAt);
  assert.ok(Object.keys(created.recipe).every((k) => !k.includes('_')));
  await call('POST', '/recipes', { name: ` ${name.toUpperCase()} ` }, owner, 409);
  await call('POST', '/recipes', { name }, other, 201);
  const detail = await call('GET', `/recipes/${id}`, undefined, owner, 200);
  for (const key of ['id', 'name', 'userId']) assert.equal(detail.recipe[key], created.recipe[key]);
  for (const key of ['createdAt', 'updatedAt'])
    assert.ok(
      Math.abs(Date.parse(detail.recipe[key]) - Date.parse(created.recipe[key])) < 1000,
      'MySQL DATETIME persiste segundos',
    );
  const list = await call('GET', '/recipes', undefined, owner, 200);
  assert.deepEqual(
    list.recipes.map((r) => r.id),
    [id],
  );
  assert.deepEqual(await call('GET', `/recipes/${id}/temperatures`, undefined, owner, 200), {
    temperatures: [],
  });
  const valid = {
    maxTemperatureRamp: 100,
    minTemperatureRamp: 0,
    maxTemperatureLimit: 100,
    minTemperatureLimit: 0,
    timer: '01:00:00',
    initialization: '00:00:00',
    idealTime: '00:45:00',
    orderRamp: 2,
  };
  for (const [method, path, body] of [
    ['GET', '/recipes'],
    ['POST', '/recipes', { name }],
    ['GET', `/recipes/${id}`],
    ['GET', `/recipes/${id}/temperatures`],
    ['POST', `/recipes/${id}/temperatures`, valid],
  ]) {
    await call(method, path, body, undefined, 401);
    await call(method, path, body, 'invalid', 401);
  }
  for (const bad of ['0', '-1', '1.2', 'abc', '1e2', '9007199254740992']) {
    for (const [method, suffix, body] of [
      ['GET', ''],
      ['GET', '/temperatures'],
      ['POST', '/temperatures', valid],
    ])
      assert.equal(
        (await call(method, `/recipes/${bad}${suffix}`, body, owner, 400)).error,
        'ID inválido',
      );
  }
  for (const [method, suffix, body] of [
    ['GET', ''],
    ['GET', '/temperatures'],
    ['POST', '/temperatures', valid],
    ['PUT', '', { name: 'Forbidden' }],
    ['DELETE', ''],
  ]) {
    const a = await call(method, `/recipes/${id}${suffix}`, body, other, 404);
    const b = await call(method, `/recipes/2147483647${suffix}`, body, other, 404);
    assert.deepEqual(a, b);
    assert.equal(a.error, 'Receita não encontrada');
  }
  for (const key of [
    'maxTemperatureRamp',
    'minTemperatureRamp',
    'maxTemperatureLimit',
    'minTemperatureLimit',
  ]) {
    for (const value of [undefined, null, '65', -1, 101, 2.5])
      await call('POST', `/recipes/${id}/temperatures`, { ...valid, [key]: value }, owner, 400);
  }
  for (const invalid of [
    { minTemperatureRamp: 90, maxTemperatureRamp: 80 },
    { minTemperatureLimit: 90, maxTemperatureLimit: 80 },
  ])
    await call('POST', `/recipes/${id}/temperatures`, { ...valid, ...invalid }, owner, 400);
  for (const key of ['timer', 'initialization', 'idealTime'])
    for (const value of [undefined, null, 12, '24:00:00', '00:60:00', '00:00:60', '00:10'])
      await call('POST', `/recipes/${id}/temperatures`, { ...valid, [key]: value }, owner, 400);
  for (const orderRamp of [null, '1', 1.5, 2147483648])
    await call('POST', `/recipes/${id}/temperatures`, { ...valid, orderRamp }, owner, 400);
  const t = await call('POST', `/recipes/${id}/temperatures`, valid, owner, 201);
  assert.equal(t.message, 'Temperatura criada com sucesso');
  assert.equal(t.temperature.orderRamp, 2);
  assert.equal(t.temperature.recipeId, id);
  assert.ok(!('activeTemperature' in t.temperature));
  await call('POST', `/recipes/${id}/temperatures`, { ...valid, orderRamp: 1 }, owner, 201);
  const ramps = await call('GET', `/recipes/${id}/temperatures`, undefined, owner, 200);
  assert.deepEqual(
    ramps.temperatures.map((t) => t.orderRamp),
    [1, 2],
  );
  assert.ok(ramps.temperatures.every((t) => Object.keys(t).every((k) => !k.includes('_'))));
  const optional = { ...valid };
  delete optional.orderRamp;
  await call('POST', `/recipes/${id}/temperatures`, optional, owner, 201);
  await call('PUT', `/recipes/${id}`, { name: ' Renamed recipe ' }, owner, 200);
  assert.equal(
    (await call('GET', `/recipes/${id}`, undefined, owner, 200)).recipe.name,
    'Renamed recipe',
  );
  await call('DELETE', `/recipes/${id}`, undefined, owner, 204);
  const doc = JSON.parse(readFileSync(new URL('../config/swagger.json', import.meta.url)));
  for (const [path, method] of [
    ['/recipes', 'get'],
    ['/recipes', 'post'],
    ['/recipes/{id}', 'get'],
    ['/recipes/{id}/temperatures', 'get'],
    ['/recipes/{id}/temperatures', 'post'],
  ]) {
    const op = doc.paths[path][method];
    assert.ok(op.security[0].bearerAuth);
    assert.ok(op.responses[401]);
    assert.ok(op.responses[500]);
    checks++;
  }
  console.log(
    `PASS: ${checks} verificações de status/Swagger, mais assertions de payload, isolamento, nomes, limites, horarios, persistencia e ordem.`,
  );
} finally {
  for (const token of tokens) await call('DELETE', '/user', undefined, token, 204);
}
