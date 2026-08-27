const { Router } = require("express");
const requireAuth = require("../middlewares/auth");
const { list, create, update, remove, contribute } = require("../controllers/goalsController");

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.post("/:id/contribute", contribute);
router.delete("/:id", remove);

module.exports = router;
