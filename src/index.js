import app from './app';
const { PORT } = require('./config');
const { initConnection } = require('./database');
// import { createRoles } from './libs/initialSetup';

// app.listen(3000);

initConnection()
  .then(() => {
    console.log('La base de datos ha sido conectada');
    app.listen(PORT, () => {
      console.info(`Escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

// createRoles();
