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


// [채민][item.routes] 판매글 작성, 수정 ==================================================
// 판매글 생성
router.post(
  '/items',
  Auth,
  multer.upload.single('postImgUrl'),
  itemController.createPost
);

// 판매글 수정
router.put(
  '/items/:item_id',
  Auth,
  multer.upload.single('postImgUrl'),
  postController.updatePost
);

// 판매글 상태 수정
router.put('/items/:item_id', Auth, itemController.updateStatus);

module.exports = router;
