import 'reflect-metadata';
import express from 'express';
import { useExpressServer } from 'routing-controllers';
import { ProductController } from './controllers/ProductControllers';
import cors from 'cors';

const app = express();

app.use(cors());

useExpressServer(app, {
  routePrefix: '/bp',
  controllers: [ProductController],
  validation: true,
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/bp`);
});
