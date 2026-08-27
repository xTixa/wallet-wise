const { Router } = require("express");
const { requestReset, resetPassword } = require("../controllers/passwordResetController");

const router = Router();

router.post("/request", requestReset);
router.post("/reset", resetPassword);

module.exports = router;
