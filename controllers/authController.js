// code-wiki:start
// Summary: Atende o login: valida o corpo, chama o serviço de credenciais e traduz a falha em status HTTP.
// Description: E-mail ou senha ausentes respondem 400 antes de qualquer consulta ao banco.
// Credencial inválida responde 401 e qualquer outra falha responde 500, sempre com a chave de erro em português.
// Na resposta de sucesso vêm o token e o perfil, no envelope definido pelo contrato.
// O login bem-sucedido é gravado no histórico em segundo plano, sem atrasar nem derrubar a resposta.
// code-wiki:end
import AuthService from '../services/authService.js';
import LoginHistoryService from '../services/loginHistoryService.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha não podem estar vazios' });
    }

    const data = await AuthService.login(email, password);
    // Registro em segundo plano: falha no histórico não pode impedir o login.
    // No Render, o Cloudflare sobrescreve CF-Connecting-IP com o IP real; req.ip seria o do proxy.
    const ip = req.get('cf-connecting-ip') || req.ip;
    LoginHistoryService.register(data.user.id, ip).catch((error) =>
      console.error('Erro ao registrar histórico de login', error),
    );
    return res.status(200).json(data);
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIAL') {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export default login;
