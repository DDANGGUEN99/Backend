const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const ItemController = require('../controllers/item.controller');
const itemController = new ItemController();

// GET: 게시글 전체 조회
router.get('/', itemController.getItems);

// GET: 월드컵 상세 조회
router.get('/:item_id', itemController.getItem);

// DELETE: 월드컵 삭제
router.delete(
  '/:item_id',
  authMiddleware,
  itemController.deleteItem,
);

module.exports = router;
