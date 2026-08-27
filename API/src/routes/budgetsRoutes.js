const { Router } = require("express");
const requireAuth = require("../middlewares/auth");
const { list, create, update, remove } = require("../controllers/budgetsController");

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
