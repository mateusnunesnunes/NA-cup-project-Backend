const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /users – lista todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true } // segurança: não retorna senha
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter os usuários.' });
  }
};

// GET /users/:id – um usuário específico
exports.getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter o usuário.' });
  }
};

// POST /users – cria novo usuário
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
      data: { name, email, password } // hash da senha viria aqui, se for o caso
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
};

// PUT /users/:id – atualiza usuário
exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, password }
    });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
};

// DELETE /users/:id – deleta usuário
exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
};

// GET /users/:id/albums – lista álbuns de um usuário
exports.getUserAlbums = async (req, res) => {
  console.log("pegando album")
  try {
    const id = parseInt(req.params.id);
    console.log("Buscando álbuns do usuário:", id);

    const userWithAlbums = await prisma.user.findUnique({
      where: { id },
      select: {
        albums: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            createdAt: true,
            isMain: true,
            albumItems: {
              select: {
                owned: true,
                sticker: {
                  select: {
                    id: true,
                    number: true,
                    name: true,
                    country: true,
                    player: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!userWithAlbums) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Transformar albumItems em stickers diretamente no retorno
    const albumsWithStickers = userWithAlbums.albums.map(album => ({
      ...album,
      stickers: album.albumItems.map(item => ({
        ...item.sticker,
        owned: item.owned
      }))
    }));

    res.json(albumsWithStickers);

  } catch (error) {
    console.error('Erro ao buscar álbuns do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter álbuns.' });
  }
};


