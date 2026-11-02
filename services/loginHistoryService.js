// code-wiki:start
// Summary: Registra cada login bem-sucedido e lista as entradas recentes da conta.
// Description: O IP vem da requisição; IPs locais ou privados viram "Rede local" sem consulta externa.
// Para IP público, a cidade, o estado e o país vêm do ip-api.com com tempo limite curto; se falhar, fica "Desconhecida".
// O status marca se o IP já tinha aparecido antes na mesma conta. A listagem traz as 20 entradas mais recentes.
// code-wiki:end
import LoginHistory from '../models/loginHistoryModel.js';

const PRIVATE_IP = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc|fd|fe80)/i;

const locate = async (ip) => {
  if (PRIVATE_IP.test(ip)) return 'Rede local';
  try {
    // ip-api.com gratuito só atende HTTP; sem dado sensível além do IP
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,region,country&lang=pt-BR`,
      { signal: AbortSignal.timeout(2000) },
    );
    const data = await res.json();
    if (data.status === 'success' && data.city) {
      return [data.city, data.region, data.country].filter(Boolean).join(', ');
    }
  } catch {}
  return 'Desconhecida';
};

class LoginHistoryService {
  async register(userId, rawIp) {
    const ipAddress = (rawIp || 'desconhecido').replace(/^::ffff:/, '');
    const known = await LoginHistory.findOne({ where: { userId, ipAddress } });
    const location = await locate(ipAddress);
    await LoginHistory.create({ userId, ipAddress, location, status: known !== null });
  }

  async listByUser(userId) {
    return LoginHistory.findAll({
      where: { userId },
      attributes: ['id', 'ipAddress', 'location', 'status', 'loggedAt'],
      order: [['loggedAt', 'DESC']],
      limit: 20,
    });
  }
}

export default new LoginHistoryService();
