// code-wiki:start
// Summary: Testa a conexão com o banco na partida e registra o resultado sem derrubar a aplicação.
// Description: A autenticação é disparada na inicialização e o sucesso sai no console com a confirmação da conexão.
// A falha também é registrada, mas não interrompe o processo: a aplicação sobe mesmo sem banco no momento do arranque.
// code-wiki:end
import Connection from './sequelize-config.js';

export async function authDB() {
  try {
    await Connection.authenticate();
    console.log('Conexão com o banco de dados realizada com sucesso');
  } catch (error) {
    console.error(`Ocorreu um erro ao tentar se conectar ao banco: ${error}`);
  }
}
