// code-wiki:start
// Summary: Recebe a foto do perfil em memória e traduz falha de multipart em resposta JSON.
// Description: A imagem é aceita apenas como JPEG ou PNG e fica em memória, com limite de dez megabytes.
// Arquivo grande demais responde 413, tipo não suportado responde 415, multipart malformado responde 400 e o resto vira 500.
// O nome do campo aceito no formulário é único, de modo que o resto do corpo multipart é ignorado.
// code-wiki:end
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) return cb(null, true);
    return cb(new Error('UNSUPPORTED_IMAGE_TYPE'));
  },
});

const receiveImage = upload.single('image');
export const uploadUserImage = (req, res, next) => {
  receiveImage(req, res, (error) => {
    if (!error) return next();
    if (error.code === 'LIMIT_FILE_SIZE')
      return res.status(413).json({ error: 'Imagem excede o limite de 10 MB' });
    if (error.message === 'UNSUPPORTED_IMAGE_TYPE')
      return res.status(415).json({ error: 'Envie uma imagem JPEG ou PNG' });
    if (error instanceof multer.MulterError)
      return res.status(400).json({ error: 'Formulário de imagem inválido' });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  });
};

export default upload;
