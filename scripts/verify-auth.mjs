import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const base = process.env.AUTH_TEST_BASE;
assert.ok(
  base === 'http://127.0.0.1:8080',
  'Defina AUTH_TEST_BASE para uma API descartável local em :8080',
);
const failures = [];
function check(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    failures.push(name);
    console.error(`FAIL ${name}: ${e.message}`);
  }
}
async function call(method, path, body, token) {
  const r = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await r.text();
  return [r.status, text ? JSON.parse(text) : null];
}
const unique = Date.now();
const tokens = [];
for (const n of [1, 2]) {
  const email = `auth-${unique}-${n}@example.test`;
  const r = await call('POST', '/user', {
    name: `Auth ${n}`,
    email,
    password: 'Test-only-auth-password',
  });
  assert.equal(r[0], 201);
  const login = await call('POST', '/login', { email, password: 'Test-only-auth-password' });
  assert.equal(login[0], 200);
  tokens.push(login[1].token);
  check('login user.urlImage sem password/image', () => {
    assert.ok(Object.hasOwn(login[1].user, 'urlImage'));
    assert.ok(!('image' in login[1].user));
    assert.ok(!('password' in login[1].user));
  });
}
let r = await call('POST', '/login', {});
check('login incompleto 400 error', () => {
  assert.equal(r[0], 400);
  assert.equal(typeof r[1].error, 'string');
});
r = await call('POST', '/login', { email: 'absent@example.test', password: 'wrong' });
check('login inválido 401 error', () => {
  assert.equal(r[0], 401);
  assert.equal(r[1].error, 'E-mail ou senha inválidos');
});
r = await call('GET', '/user');
check('sem token 401', () => {
  assert.equal(r[0], 401);
  assert.equal(r[1].error, 'Token não informado');
});
r = await call('GET', '/user', undefined, 'invalid');
check('token inválido 401', () => {
  assert.equal(r[0], 401);
  assert.equal(r[1].error, 'Token inválido ou expirado');
});
r = await call('GET', '/user', undefined, tokens[0]);
check('perfil sem hash', () => {
  assert.equal(r[0], 200);
  assert.ok(!('password' in r[1].user));
});
r = await call('POST', '/recipes', { name: `Auth recipe ${unique}` }, tokens[0]);
assert.equal(r[0], 201);
const id = r[1].recipe.id;
for (const [method, path, body] of [
  ['PUT', `/recipes/${id}`, { name: 'Forbidden' }],
  ['DELETE', `/recipes/${id}`],
  ['GET', `/recipes/${id}/temperatures`],
  ['POST', `/recipes/${id}/temperatures`, {}],
]) {
  const foreign = await call(method, path, body, tokens[1]);
  const absent = await call(method, path.replace(String(id), '2147483647'), body, tokens[1]);
  check(`${method} ${path}: alheio e inexistente indistinguíveis`, () => {
    assert.deepEqual(foreign, [404, { error: 'Receita não encontrada' }]);
    assert.deepEqual(absent, foreign);
  });
}
r = await call('GET', '/recipes', undefined, tokens[1]);
check('listagem filtra por dono', () => {
  assert.equal(r[0], 200);
  assert.ok(!r[1].recipes.some((v) => v.id === id));
});
const doc = JSON.parse(readFileSync(new URL('../config/swagger.json', import.meta.url), 'utf8'));
check('Swagger Bearer JWT', () => {
  assert.equal(doc.components.securitySchemes.bearerAuth.scheme, 'bearer');
});
check('Swagger login urlImage e erros', () => {
  const responses = doc.paths['/login'].post.responses;
  assert.ok(responses[200].content['application/json'].schema.properties.user.properties.urlImage);
  for (const s of [400, 401, 500])
    assert.ok(responses[s].content['application/json'].schema.properties.error);
});
for (const token of tokens) await call('DELETE', '/user', undefined, token);
assert.equal(failures.length, 0, failures.join('; '));
