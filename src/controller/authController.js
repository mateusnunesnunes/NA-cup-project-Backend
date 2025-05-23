const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  console.log('BODY:', req.body);

  const { email, password } = req.body;
  
  if(!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // Busca usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if(!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Compara senha com hash salvo
    const isPasswordValid = await bcrypt.compare(password, user.password);

  
    if(!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Gera token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
