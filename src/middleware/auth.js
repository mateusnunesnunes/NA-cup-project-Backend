const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

   if (process.env.NODE_ENV == "dev") {
    // Em desenvolvimento, pula a autenticação
    
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: 'Token não fornecido (Authorization: Bearer)' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}


module.exports = authenticateToken;
