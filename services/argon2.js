// code-wiki:start
// Summary: Gera o hash de senha com Argon2id e custo de memória alto.
// Description: O hash usa Argon2id com 64 MiB de memória, três passes e paralelismo de grau um.
// Falha na geração é registrada e convertida em erro sentinela, para o controller responder sem expor o erro interno.
// code-wiki:end
import argon2 from 'argon2';

const argon2IdConfig = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1,
};

export async function createHash(password) {
  try {
    const hash = await argon2.hash(password, argon2IdConfig);
    return hash;
  } catch (error) {
    console.log(`Ocorreu um erro ao gerar o hash de senha: ${error}`);
    throw new Error('HASH_GENERATION_FAILED');
  }
}
