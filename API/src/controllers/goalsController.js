const prisma = require("../services/prisma");

async function list(req, res) {
  const goals = await prisma.goals.findMany({
    where: { user_id: req.userId },
    orderBy: { created_at: "asc" },
  });
  res.json(goals);
}

async function create(req, res) {
  const { title, description, target_amount, deadline, color, icon } = req.body;

  if (!title || !target_amount) {
    return res.status(400).json({ error: "title e target_amount são obrigatórios" });
  }

  const goal = await prisma.goals.create({
    data: {
      user_id: req.userId,
      title,
      description,
      target_amount,
      deadline: deadline ? new Date(deadline) : undefined,
      color,
      icon,
    },
  });

  res.status(201).json(goal);
}

async function update(req, res) {
  const { id } = req.params;
  const { title, description, target_amount, deadline, color, icon, status } = req.body;

  const existing = await prisma.goals.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Objetivo não encontrado" });
  }

  const goal = await prisma.goals.update({
    where: { id },
    data: {
      title,
      description,
      target_amount,
      deadline: deadline ? new Date(deadline) : undefined,
      color,
      icon,
      status,
    },
  });

  res.json(goal);
}

async function contribute(req, res) {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "amount deve ser um valor positivo" });
  }

  const existing = await prisma.goals.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Objetivo não encontrado" });
  }

  const newAmount = Number(existing.current_amount) + Number(amount);
  const reachedTarget = newAmount >= Number(existing.target_amount);

  const goal = await prisma.goals.update({
    where: { id },
    data: {
      current_amount: newAmount,
      status: reachedTarget ? "COMPLETED" : existing.status,
    },
  });

  res.json(goal);
}

async function remove(req, res) {
  const { id } = req.params;

  const existing = await prisma.goals.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Objetivo não encontrado" });
  }

  await prisma.goals.delete({ where: { id } });

  res.status(204).send();
}

module.exports = { list, create, update, remove, contribute };
