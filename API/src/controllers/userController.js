const bcrypt = require("bcryptjs");
const prisma = require("../services/prisma");

const PROFILE_FIELDS = {
  id: true,
  name: true,
  email: true,
  currency: true,
  language: true,
  theme: true,
  notify_budget_alerts: true,
  notify_recurring_reminders: true,
  notify_goal_progress: true,
};

async function getMe(req, res) {
  const user = await prisma.users.findUnique({
    where: { id: req.userId },
    select: PROFILE_FIELDS,
  });
  res.json(user);
}

async function updateMe(req, res) {
  const {
    name,
    currency,
    language,
    theme,
    notify_budget_alerts,
    notify_recurring_reminders,
    notify_goal_progress,
  } = req.body;

  const user = await prisma.users.update({
    where: { id: req.userId },
    data: {
      name,
      currency,
      language,
      theme,
      notify_budget_alerts,
      notify_recurring_reminders,
      notify_goal_progress,
    },
    select: PROFILE_FIELDS,
  });

  res.json(user);
}

async function updatePassword(req, res) {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: "current_password e new_password são obrigatórios" });
  }

  if (new_password.length < 8) {
    return res.status(400).json({ error: "A nova palavra-passe deve ter pelo menos 8 caracteres" });
  }

  const user = await prisma.users.findUnique({ where: { id: req.userId } });

  const valid = await bcrypt.compare(current_password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Palavra-passe atual incorreta" });
  }

  const password_hash = await bcrypt.hash(new_password, 10);
  await prisma.users.update({
    where: { id: req.userId },
    data: { password_hash },
  });

  res.status(204).send();
}

module.exports = { getMe, updateMe, updatePassword };
