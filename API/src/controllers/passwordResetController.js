const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../services/prisma");
const { sendPasswordResetEmail } = require("../services/mailer");

const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function requestReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "email é obrigatório" });
  }

  const genericResponse = () =>
    res.json({ message: "Se existir uma conta com este email, vais receber instruções de recuperação." });

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return genericResponse();
  }

  const token = crypto.randomBytes(32).toString("hex");
  const token_hash = hashToken(token);

  await prisma.password_reset_tokens.create({
    data: {
      user_id: user.id,
      token_hash,
      expires_at: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    console.error("Falha ao enviar email de recuperação:", err.message);
  }

  return genericResponse();
}

async function resetPassword(req, res) {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return res.status(400).json({ error: "token e new_password são obrigatórios" });
  }

  if (new_password.length < 8) {
    return res.status(400).json({ error: "A nova palavra-passe deve ter pelo menos 8 caracteres" });
  }

  const token_hash = hashToken(token);

  const resetToken = await prisma.password_reset_tokens.findUnique({
    where: { token_hash },
  });

  if (!resetToken || resetToken.used_at || resetToken.expires_at < new Date()) {
    return res.status(400).json({ error: "Link de recuperação inválido ou expirado" });
  }

  const password_hash = await bcrypt.hash(new_password, 10);

  await prisma.$transaction([
    prisma.users.update({
      where: { id: resetToken.user_id },
      data: { password_hash },
    }),
    prisma.password_reset_tokens.update({
      where: { id: resetToken.id },
      data: { used_at: new Date() },
    }),
  ]);

  res.status(204).send();
}

module.exports = { requestReset, resetPassword };
