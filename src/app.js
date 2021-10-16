import express from 'express';
import morgan from 'morgan'; //morgan es un middleware de express
import pkg from '../package.json';
import productRoutes from './routes/products.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.set('pkg', pkg);

// le indico que voy a estar en modo de desarrollo, para que cuando entre al browser muestre en consola algunas cosas
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
  });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;
