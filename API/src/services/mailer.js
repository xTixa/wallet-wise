const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendPasswordResetEmail(to, resetUrl) {
  await transporter.sendMail({
    from: `"WalletWise" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Repor a tua palavra-passe - WalletWise",
    html: `
      <p>Olá,</p>
      <p>Recebemos um pedido para repor a palavra-passe da tua conta WalletWise.</p>
      <p><a href="${resetUrl}">Clica aqui para definir uma nova palavra-passe</a></p>
      <p>Este link expira em 1 hora. Se não pediste isto, podes ignorar este email.</p>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
