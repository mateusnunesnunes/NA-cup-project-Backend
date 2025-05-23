const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('./middleware/auth.js');
const loginLimiter = require('./middleware/loginLimiter.js');


//const authRoutes = require('./routes/auth');
const albumRoutes = require('./routes/album');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth.js');


dotenv.config({
  path: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev'
});

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/albums',authenticateToken, albumRoutes);
app.use('/users',authenticateToken, userRoutes);
app.use('/login',loginLimiter, authRoutes);

app.get('/perfil', authenticateToken, (req, res) => {
  res.json({ message: 'Você está autenticado!', user: req.user });
});

// deve ficar por último!
app.use('/', (req, res) => {
  res.send('API de Álbuns');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Usando ${process.env.NODE_ENV}`);
  console.log(`Usando ${process.env.JWT_SECRET}`);
});
