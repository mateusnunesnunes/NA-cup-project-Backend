const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

//const authRoutes = require('./routes/auth');
const albumRoutes = require('./routes/album');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/albums', albumRoutes);
app.use('/users', userRoutes);

// deve ficar por último!
app.use('/', (req, res) => {
  res.send('API de Álbuns');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
