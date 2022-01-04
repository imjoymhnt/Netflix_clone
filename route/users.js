const { register, signin } = require("../controller/auth");

const router = require("express").Router();

router.post("/register", register);
router.post("/signin", signin);

module.exports = router;
