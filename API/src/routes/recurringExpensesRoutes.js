const { Router } = require("express");
const requireAuth = require("../middlewares/auth");
const {
  list,
  create,
  update,
  remove,
  confirmPayment,
} = require("../controllers/recurringExpensesController");

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.post("/:id/confirm", confirmPayment);
router.delete("/:id", remove);

module.exports = router;
