const express = require('express');
const router = express.Router();

// const likeRouter = require('./like.routes');
// const itemRouter = require('./item.routes');
const userRouter = require('./user.routes.js');
const mypageRouter = require('./mypage.routes.js');

router.use('/', [userRouter]);
router.use('/mypage', [mypageRouter]);
// router.use('/item', [itemRouter, likeRouter]);

module.exports = router;
