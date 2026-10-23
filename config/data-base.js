import Connection from './sequelize-config.js';

export async function authDB() {
  try {
    await Connection.authenticate();
    console.log('Conexão com o banco de dados realizada com sucesso');
  } catch (error) {
    console.error(`Ocorreu um erro ao tentar se conectar ao banco: ${error}`);
  }
}
