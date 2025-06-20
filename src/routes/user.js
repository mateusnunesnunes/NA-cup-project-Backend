const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Rotas para usuários
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// rota para obter os álbuns de um usuário
router.get('/:id/albums', userController.getUserAlbums);

module.exports = router;
