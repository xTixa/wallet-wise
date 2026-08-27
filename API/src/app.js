require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const accountsRoutes = require("./routes/accountsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const transactionsRoutes = require("./routes/transactionsRoutes");
const goalsRoutes = require("./routes/goalsRoutes");
const budgetsRoutes = require("./routes/budgetsRoutes");
const recurringExpensesRoutes = require("./routes/recurringExpensesRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins ?? true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/recurring-expenses", recurringExpensesRoutes);
app.use("/api/me", userRoutes);
app.use("/api/password-reset", passwordResetRoutes);

module.exports = app;
