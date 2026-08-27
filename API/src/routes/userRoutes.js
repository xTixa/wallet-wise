const { Router } = require("express");
const requireAuth = require("../middlewares/auth");
const { getMe, updateMe, updatePassword } = require("../controllers/userController");

const router = Router();

router.use(requireAuth);

router.get("/", getMe);
router.put("/", updateMe);
router.put("/password", updatePassword);

module.exports = router;
