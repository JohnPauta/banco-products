import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Servir archivos estáticos desde /browser
 * (JS, CSS, imágenes, etc.)
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }),
);

/**
 * Redirigir cualquier otra ruta a Angular SSR
 * (rutas como /products, /products/add, etc.)
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Iniciar el servidor si este módulo es el punto de entrada
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`✅ SSR activo en http://localhost:${port}`);
  });
}

/**
 * Exportar el manejador para Angular CLI o Firebase Functions
 */
export const reqHandler = createNodeRequestHandler(app);
