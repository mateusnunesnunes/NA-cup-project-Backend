const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 segundos
  max: 3,              // máximo 3 requisições
  message: 'Muitas tentativas. Tente novamente em alguns segundos.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
