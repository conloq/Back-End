// code-wiki:start
// Summary: Valida cadastro, consulta, alteração, exclusão e foto do usuário autenticado.
// Description: O cadastro normaliza nome e e-mail, recusa e-mail malformado e senha com espaços, e grava a senha como hash.
// E-mail já existente responde 409 e perfil inexistente responde 404; o resto vira 500.
// A alteração repete as mesmas validações do cadastro e só troca a senha quando uma nova senha vem no corpo.
// A foto é enviada em fluxo para a nuvem, e o endereço devolvido é gravado no perfil antes da resposta.
// O telefone é aceito e devolvido em camelCase, igual ao model e ao contrato público.
// code-wiki:end
import userService from '../services/userService.js';
import { createHash } from '../services/argon2.js';
import cloudinary from '../config/cloudinary.js';

const isValidEmail = (email) => {
  if (/\s/.test(email)) return false;
  const at = email.indexOf('@');
  if (at <= 0 || at !== email.lastIndexOf('@')) return false;
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf('.');
  return dot > 0 && dot < domain.length - 1;
};

const createUser = async (req, res) => {
  try {
    const { name = '', email = '', password = '' } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      (password !== undefined && typeof password !== 'string')
    ) {
      return res.status(400).json({ error: 'Nome, e-mail e senha devem ser texto' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail)
      return res.status(400).json({ error: 'Nome ou E-mail não podem estar vazios' });

    if (!isValidEmail(cleanEmail)) return res.status(400).json({ error: 'E-mail inválido' });

    if (!password) return res.status(400).json({ error: 'A senha não pode ser vazia' });

    if (/\s/.test(password))
      return res.status(400).json({ error: 'A senha não pode conter espaços' });

    const passwordHash = await createHash(password);

    await userService.createUser(cleanName, cleanEmail, passwordHash);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'E-mail já existente' });
    }
    console.log(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const showUser = async (req, res) => {
  try {
    const id = req.userId;

    const user = await userService.showUser(id);
    res.status(200).json({ user: user });
  } catch (error) {
    if (error.message === 'ID_NOT_EXISTS') return res.status(404).json({ error: 'ID não existe' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.userId;

    await userService.deleteUser(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name = '', email = '', phone = '', password } = req.body;
    const id = req.userId;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      (password !== undefined && typeof password !== 'string')
    ) {
      return res.status(400).json({ error: 'Nome, e-mail e senha devem ser texto' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail)
      return res.status(400).json({ error: 'Nome ou E-mail não podem estar vazios' });

    if (!isValidEmail(cleanEmail)) return res.status(400).json({ error: 'E-mail inválido' });

    if (password) {
      if (/\s/.test(password))
        return res.status(400).json({ error: 'A senha não pode conter espaços' });
    }

    if (!password) {
      await userService.updateUser(id, cleanName, cleanEmail, phone);
      return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    }

    const hashPassword = await createHash(password);
    await userService.updateUser(id, cleanName, cleanEmail, phone, hashPassword);
    return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'E-mail já existente' });
    }
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateImage = async (req, res) => {
  try {
    const id = req.userId;
    const image = req.file;

    if (!image) return res.status(400).json({ error: 'Imagem não foi enviada' });

    const resultCloudinary = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'Users Mash',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(image.buffer);
    });

    await userService.updateImage(id, resultCloudinary.secure_url);
    return res
      .status(200)
      .json({ message: 'Imagem enviada com sucesso!', url: resultCloudinary.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export { createUser, showUser, deleteUser, updateUser, updateImage };
