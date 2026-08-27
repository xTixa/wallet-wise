const prisma = require("../services/prisma");

async function list(req, res) {
  const { month, year } = req.query;

  const where = {
    user_id: req.userId,
    ...(month && { month: Number(month) }),
    ...(year && { year: Number(year) }),
  };

  const budgets = await prisma.budgets.findMany({
    where,
    include: { categories: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const periodStart = new Date(Date.UTC(budget.year, budget.month - 1, 1));
      const periodEnd = new Date(Date.UTC(budget.year, budget.month, 1));

      const { _sum } = await prisma.transactions.aggregate({
        where: {
          user_id: req.userId,
          category_id: budget.category_id,
          type: "EXPENSE",
          transaction_date: { gte: periodStart, lt: periodEnd },
        },
        _sum: { amount: true },
      });

      return { ...budget, spent: Number(_sum.amount ?? 0) };
    }),
  );

  res.json(budgetsWithSpent);
}

async function create(req, res) {
  const { category_id, month, year, limit_amount } = req.body;

  if (!category_id || !month || !year || !limit_amount) {
    return res.status(400).json({ error: "category_id, month, year e limit_amount são obrigatórios" });
  }

  const category = await prisma.categories.findFirst({
    where: { id: category_id, user_id: req.userId },
  });
  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const existing = await prisma.budgets.findFirst({
    where: { user_id: req.userId, category_id, month: Number(month), year: Number(year) },
  });
  if (existing) {
    return res.status(409).json({ error: "Já existe um orçamento para esta categoria neste mês" });
  }

  const budget = await prisma.budgets.create({
    data: {
      user_id: req.userId,
      category_id,
      month: Number(month),
      year: Number(year),
      limit_amount,
    },
    include: { categories: true },
  });

  res.status(201).json(budget);
}

async function update(req, res) {
  const { id } = req.params;
  const { limit_amount } = req.body;

  const existing = await prisma.budgets.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Orçamento não encontrado" });
  }

  const budget = await prisma.budgets.update({
    where: { id },
    data: { limit_amount },
    include: { categories: true },
  });

  res.json(budget);
}

async function remove(req, res) {
  const { id } = req.params;

  const existing = await prisma.budgets.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Orçamento não encontrado" });
  }

  await prisma.budgets.delete({ where: { id } });

  res.status(204).send();
}

module.exports = { list, create, update, remove };
