const prisma = require("../services/prisma");

async function list(req, res) {
  const { account_id, category_id, type, from, to } = req.query;

  const where = {
    user_id: req.userId,
    ...(account_id && { account_id }),
    ...(category_id && { category_id }),
    ...(type && { type }),
    ...((from || to) && {
      transaction_date: {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      },
    }),
  };

  const transactions = await prisma.transactions.findMany({
    where,
    orderBy: { transaction_date: "desc" },
    include: { accounts: true, categories: true },
  });

  res.json(transactions);
}

async function create(req, res) {
  const {
    account_id,
    category_id,
    title,
    description,
    amount,
    type,
    transaction_date,
    payment_method,
    merchant,
    location,
    receipt_url,
  } = req.body;

  if (!account_id || !category_id || !title || !amount || !type || !transaction_date || !payment_method) {
    return res.status(400).json({
      error: "account_id, category_id, title, amount, type, transaction_date e payment_method são obrigatórios",
    });
  }

  const account = await prisma.accounts.findFirst({
    where: { id: account_id, user_id: req.userId },
  });
  if (!account) {
    return res.status(404).json({ error: "Conta não encontrada" });
  }

  const category = await prisma.categories.findFirst({
    where: { id: category_id, user_id: req.userId },
  });
  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const transaction = await prisma.transactions.create({
    data: {
      user_id: req.userId,
      account_id,
      category_id,
      title,
      description,
      amount,
      type,
      transaction_date: new Date(transaction_date),
      payment_method,
      merchant,
      location,
      receipt_url,
    },
  });

  res.status(201).json(transaction);
}

async function update(req, res) {
  const { id } = req.params;
  const {
    account_id,
    category_id,
    title,
    description,
    amount,
    type,
    transaction_date,
    payment_method,
    merchant,
    location,
    receipt_url,
    status,
  } = req.body;

  const existing = await prisma.transactions.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Transação não encontrada" });
  }

  if (account_id) {
    const account = await prisma.accounts.findFirst({
      where: { id: account_id, user_id: req.userId },
    });
    if (!account) {
      return res.status(404).json({ error: "Conta não encontrada" });
    }
  }

  if (category_id) {
    const category = await prisma.categories.findFirst({
      where: { id: category_id, user_id: req.userId },
    });
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
  }

  const transaction = await prisma.transactions.update({
    where: { id },
    data: {
      account_id,
      category_id,
      title,
      description,
      amount,
      type,
      transaction_date: transaction_date ? new Date(transaction_date) : undefined,
      payment_method,
      merchant,
      location,
      receipt_url,
      status,
    },
  });

  res.json(transaction);
}

async function remove(req, res) {
  const { id } = req.params;

  const existing = await prisma.transactions.findFirst({
    where: { id, user_id: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Transação não encontrada" });
  }

  await prisma.transactions.delete({ where: { id } });

  res.status(204).send();
}

module.exports = { list, create, update, remove };
