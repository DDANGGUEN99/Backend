const express = require("express");
const router = express.Router();

const itemRouter = require("./item.routes");
const authRouter = require("./auth.routes");
const likeRouter = require("./like.routes");
const mypageRouter = require("./mypage.routes");

router.use("/item", [itemRouter, likeRouter]);
router.use("/auth", [authRouter]);
router.use("/mypage", [mypageRouter]);

module.exports = router;