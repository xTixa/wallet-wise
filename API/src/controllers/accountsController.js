const prisma = require("../services/prisma");

async function list(req, res) {
  const accounts = await prisma.accounts.findMany({
    where: { user_id: req.userId },
    orderBy: { created_at: "asc" },
  });
  res.json(accounts);
}

async function create(req, res) {
  const { name, type, initial_balance, color, icon } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "name e type são obrigatórios" });
  }

  const account = await prisma.accounts.create({
    data: {
      user_id: req.userId,
      name,
      type,
      initial_balance: initial_balance ?? 0,
      color,
      icon,
    },
  });

  res.status(201).json(account);
}

async function update(req, res) {
  const { id } = req.params;
  const { name, type, initial_balance, color, icon, is_archived } = req.body;

  const existing = await prisma.accounts.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Conta não encontrada" });
  }

  const account = await prisma.accounts.update({
    where: { id },
    data: { name, type, initial_balance, color, icon, is_archived },
  });

  res.json(account);
}

async function remove(req, res) {
  const { id } = req.params;

  const existing = await prisma.accounts.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Conta não encontrada" });
  }

  await prisma.accounts.delete({ where: { id } });

  res.status(204).send();
}

module.exports = { list, create, update, remove };
