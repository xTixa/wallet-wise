const prisma = require("../services/prisma");

function advanceDate(date, frequency) {
  const next = new Date(date);
  if (frequency === "WEEKLY") next.setDate(next.getDate() + 7);
  else if (frequency === "MONTHLY") next.setMonth(next.getMonth() + 1);
  else if (frequency === "YEARLY") next.setFullYear(next.getFullYear() + 1);
  return next;
}

async function list(req, res) {
  const recurring = await prisma.recurring_expenses.findMany({
    where: { user_id: req.userId },
    include: { categories: true, accounts: true },
    orderBy: { next_due_date: "asc" },
  });
  res.json(recurring);
}

async function create(req, res) {
  const { title, amount, category_id, account_id, frequency, next_due_date, payment_method } = req.body;

  if (!title || !amount || !category_id || !account_id || !frequency || !next_due_date || !payment_method) {
    return res.status(400).json({
      error: "title, amount, category_id, account_id, frequency, next_due_date e payment_method são obrigatórios",
    });
  }

  if (!["WEEKLY", "MONTHLY", "YEARLY"].includes(frequency)) {
    return res.status(400).json({ error: "frequency deve ser WEEKLY, MONTHLY ou YEARLY" });
  }

  const account = await prisma.accounts.findFirst({ where: { id: account_id, user_id: req.userId } });
  if (!account) {
    return res.status(404).json({ error: "Conta não encontrada" });
  }

  const category = await prisma.categories.findFirst({ where: { id: category_id, user_id: req.userId } });
  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const recurring = await prisma.recurring_expenses.create({
    data: {
      user_id: req.userId,
      title,
      amount,
      category_id,
      account_id,
      frequency,
      next_due_date: new Date(next_due_date),
      payment_method,
    },
    include: { categories: true, accounts: true },
  });

  res.status(201).json(recurring);
}

async function update(req, res) {
  const { id } = req.params;
  const { title, amount, category_id, account_id, frequency, next_due_date, payment_method, is_active } = req.body;

  const existing = await prisma.recurring_expenses.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Despesa recorrente não encontrada" });
  }

  const recurring = await prisma.recurring_expenses.update({
    where: { id },
    data: {
      title,
      amount,
      category_id,
      account_id,
      frequency,
      next_due_date: next_due_date ? new Date(next_due_date) : undefined,
      payment_method,
      is_active,
    },
    include: { categories: true, accounts: true },
  });

  res.json(recurring);
}

async function remove(req, res) {
  const { id } = req.params;

  const existing = await prisma.recurring_expenses.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Despesa recorrente não encontrada" });
  }

  await prisma.recurring_expenses.delete({ where: { id } });

  res.status(204).send();
}

async function confirmPayment(req, res) {
  const { id } = req.params;

  const existing = await prisma.recurring_expenses.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Despesa recorrente não encontrada" });
  }

  const [transaction, recurring] = await prisma.$transaction([
    prisma.transactions.create({
      data: {
        user_id: req.userId,
        account_id: existing.account_id,
        category_id: existing.category_id,
        title: existing.title,
        amount: existing.amount,
        type: "EXPENSE",
        transaction_date: existing.next_due_date,
        payment_method: existing.payment_method,
      },
    }),
    prisma.recurring_expenses.update({
      where: { id },
      data: { next_due_date: advanceDate(existing.next_due_date, existing.frequency) },
      include: { categories: true, accounts: true },
    }),
  ]);

  res.json({ transaction, recurring });
}

module.exports = { list, create, update, remove, confirmPayment };
