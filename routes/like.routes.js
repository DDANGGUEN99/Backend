const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const LikesController = require('../controllers/like.controller');
const likesController = new LikesController();

// 관심목록 조회
router.get('/like', authMiddleware, likesController.getlikeItem);

// 관심목록 추가 / 삭제
router.put('/:item_id/like', authMiddleware, likesController.putlike);

module.exports = router;
