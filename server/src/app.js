import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { sequelize } from './db/index.js';
import { seedAdmin } from './db/seedAdmin.js';
import appRoutes from './routes/index.js';

// Setting up  port
const PORT = process.env.PORT || 8080;

// Instantiate express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// App routes
app.get('/', (req, res) => {
  res.send('INCIDENT REPORTING API is running..');
});
app.use('/api/', appRoutes);
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('FALLBACK HANDLE ERROR', err);
  if (!res.headersSent) {
    console.log(err);
    return res.status(500).send({
      message: 'Internal Server Error',
    });
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
    return seedAdmin();
  })
  .catch((err) => {
    console.error('Unable to sync with the database:', err);
  });
