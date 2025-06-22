// controller/albumController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /albums – retorna todos os álbuns (com stickers)
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: { albumItems: true }  // inclui figurinhas relacionadas, se existir relação
    });
    console.log(albums);
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter os álbuns.' });
  }
};

// GET /albums/:id – retorna um álbum por ID
exports.getAlbumById = async (req, res) => {
  console.log("GET /albums/:id ")
  try {
    const id = parseInt(req.params.id);
    const album = await prisma.album.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      albumItems: {
        include: {
          sticker: true
        }
      }
    }
  });
    if (!album) {
      return res.status(404).json({ error: 'Álbum não encontrado.' });
    }
    res.json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter o álbum.' });
  }
};

// POST /albums – cria um novo álbum
exports.createAlbum = async (req, res) => {
  try {
    // Supondo que req.body contenha os dados necessários (ex: title, artist, ...)
    const newAlbum = await prisma.album.create({
      data: req.body
    });
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o álbum.' });
  }
};

// PUT /albums/:id – atualiza um álbum existente
exports.updateAlbum = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedAlbum = await prisma.album.update({
      where: { id },
      data: req.body
    });
    res.json(updatedAlbum);
  } catch (error) {
    console.error(error);
    // Tratamento de erro caso o álbum não exista (Código P2025 do Prisma)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Álbum não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar o álbum.' });
  }
};

// DELETE /albums/:id – deleta um álbum por ID
exports.deleteAlbum = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.album.delete({ where: { id } });
    // 204 No Content indica sucesso sem resposta de corpo
    res.status(204).end();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Álbum não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao deletar o álbum.' });
  }
};

// PATCH /albums/:albumId/stickers/:stickerId – atualiza se a figurinha está possuída
exports.updateStickerOwnership = async (req, res) => {
  const albumId = parseInt(req.params.albumId);
  const stickerId = parseInt(req.params.stickerId);
  const { owned } = req.body;

  try {
    const updated = await prisma.albumSticker.update({
      where: {
        albumId_stickerId: {
          albumId,
          stickerId
        }
      },
      data: { owned }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);

    // Trata caso a combinação (albumId, stickerId) não exista
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Relação álbum-figurinha não encontrada.' });
    }

    res.status(500).json({ error: 'Erro ao atualizar figurinha.' });
  }
};
