// routes/album.js
const express = require('express');
const router = express.Router();

// Importa as funções do controller de álbum
const albumController = require('../controller/albumController');

// Rota para listar todos os álbuns
router.get('/', albumController.getAllAlbums);

// Rota para obter um álbum pelo ID
router.get('/:id', albumController.getAlbumById);

// Rota para criar um novo álbum
router.post('/', albumController.createAlbum);

// Rota para atualizar um álbum existente
router.put('/:id', albumController.updateAlbum);

// Rota para deletar um álbum
router.delete('/:id', albumController.deleteAlbum);

//Rota para atualizar o owned do sticker
router.patch('/:albumId/stickers/:stickerId', albumController.updateStickerOwnership);


module.exports = router;
