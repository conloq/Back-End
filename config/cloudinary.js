// code-wiki:start
// Summary: Configura o cliente de upload de imagens do Mash com as credenciais do ambiente.
// Description: As três credenciais da nuvem chegam por variável de ambiente e são aplicadas ao cliente já na importação.
// O módulo entrega o cliente pronto para envio em fluxo, usado na troca da foto de perfil.
// Também informa se as três credenciais existem: em desenvolvimento elas são opcionais e, sem elas, o upload fica desativado.
// code-wiki:end
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_KEY_CLOUDINARY,
});

export const CLOUDINARY_VARS = ['CLOUD_NAME', 'API_KEY_CLOUDINARY', 'API_SECRET_KEY_CLOUDINARY'];

export const cloudinaryConfigurado = () => CLOUDINARY_VARS.every((nome) => process.env[nome]);

export default cloudinary;
