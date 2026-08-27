const prisma = require("../services/prisma");

async function list(req, res) {
  const categories = await prisma.categories.findMany({
    where: { user_id: req.userId },
    orderBy: { created_at: "asc" },
  });
  res.json(categories);
}

async function create(req, res) {
  const { name, type, icon, color } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "name e type são obrigatórios" });
  }

  const category = await prisma.categories.create({
    data: {
      user_id: req.userId,
      name,
      type,
      icon,
      color,
    },
  });

  res.status(201).json(category);
}

async function update(req, res) {
  const { id } = req.params;
  const { name, type, icon, color } = req.body;

  const existing = await prisma.categories.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const category = await prisma.categories.update({
    where: { id },
    data: { name, type, icon, color },
  });

  res.json(category);
}

async function remove(req, res) {
  const { id } = req.params;

  const existing = await prisma.categories.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  await prisma.categories.delete({ where: { id } });

  res.status(204).send();
}

module.exports = { list, create, update, remove };
