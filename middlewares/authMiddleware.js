// code-wiki:start
// Summary: Exige token Bearer válido e coloca o identificador do usuário na requisição.
// Description: Cabeçalho ausente ou formato diferente de Bearer responde 401 com mensagem em português.
// Token inválido ou expirado também responde 401, e só a assinatura passa adiante, com o identificador do usuário disponível para os controllers.
// A chave de assinatura vem do ambiente, nunca do corpo da requisição.
// code-wiki:end
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token não informado' });

  const parts = authHeader.split(' ');
  if (parts.length != 2 || parts[0] != 'Bearer') {
    return res.status(401).json({ error: 'Formato de Token inválido' });
  }

  const token = parts[1];
  const secretKey = process.env.JWT_SECRET_KEY;

  try {
    const decoded = jwt.verify(token, secretKey);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;
