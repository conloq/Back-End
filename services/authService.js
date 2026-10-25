// code-wiki:start
// Summary: Confere credenciais e devolve token assinado e perfil público.
// Description: E-mail inexistente e senha que não confere resultam no mesmo erro de credencial inválida, sem distinguir os casos.
// O token assinado dura um dia e leva a identidade e o e-mail.
// A resposta traz o perfil com nome, e-mail e foto, sem a senha.
// code-wiki:end
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

class AuthService {
  async login(email, password) {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) throw new Error('INVALID_CREDENTIAL');

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) throw new Error('INVALID_CREDENTIAL');

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1d' });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, urlImage: user.urlImage },
    };
  }
}

export default new AuthService();
