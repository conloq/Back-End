// code-wiki:start
// Summary: Persiste perfis e impede que um e-mail em uso seja tomado por outra conta.
// Description: O cadastro consulta o e-mail antes de gravar e recusa quando ele já existe.
// A consulta do perfil exclui a senha do resultado, e a alteração só aceita e-mail livre quando ele pertence a outra conta.
// Foto, dados de contato e senha são gravados por operações separadas sobre o mesmo identificador.
// code-wiki:end
import User from '../models/userModel.js';

class UserService {
  async createUser(name, email, password) {
    const emailexists = await User.findOne({
      where: { email },
    });

    if (emailexists) throw new Error('EMAIL_EXISTS');

    await User.create({ name, email, password });
  }

  async showUser(id) {
    const newUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!newUser) throw new Error('ID_NOT_EXISTS');

    return newUser;
  }

  async deleteUser(id) {
    await User.destroy({
      where: { id },
    });
  }

  async updateUser(id, name, email, phone, password) {
    const emailexists = await User.findOne({
      where: { email },
    });

    if (emailexists && emailexists.id != id) throw new Error('EMAIL_EXISTS');

    if (!password) {
      const update = await User.update({ name, email, phone }, { where: { id } });
      return update;
    }

    const update = await User.update({ name, email, phone, password }, { where: { id } });
    return update;
  }

  async updateImage(id, url) {
    const updateImage = await User.update({ urlImage: url }, { where: { id } });
    return updateImage;
  }
}

export default new UserService();
