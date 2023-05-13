const express = require('express');
const router = express.Router();

// const likeRouter = require('./like.routes');
const itemRouter = require('./item.routes');
const userRouter = require('./user.routes.js');
const mypageRouter = require('./mypage.routes');
router.use('/', [userRouter]);
router.use('/items', [itemRouter]);
router.use('/mypage', [mypageRouter]);
module.exports = router;
