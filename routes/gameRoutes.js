const express = require("express");
const router = express.Router();
const { placeBet, cashout } = require("../controllers/gameController");

router.post("/bet", placeBet);
router.post("/cashout", cashout);

module.exports = router;