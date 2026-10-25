// code-wiki:start
// Summary: Publica a documentação da API com interface do Swagger em tema escuro.
// Description: O documento OpenAPI versionado no repositório é servido pela interface do Swagger.
// O tema escuro é aplicado por CSS próprio, gerado a partir da biblioteca de temas no arranque do router.
// code-wiki:end
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json' with { type: 'json' };
import { SwaggerTheme } from 'swagger-themes';

const Router = express.Router();
const theme = new SwaggerTheme();

Router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss: theme.getBuffer('dark') }),
);

export default Router;
