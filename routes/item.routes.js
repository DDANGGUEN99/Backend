const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const ItemController = require('../controllers/item.controller');
const itemController = new ItemController();
const multerMiddleware = require('../middlewares/multer');
const multer = require('multer');

// GET: 게시글 전체 조회
router.get('/', authMiddleware, itemController.getItems);

// GET: 게시글 상세 조회
router.get('/:item_id', authMiddleware, itemController.getItem);

// 판매글 생성
router.post(
  '/',
  authMiddleware,
  itemController.setItem,
);

// 판매글 수정
router.put(
  '/:item_id', 
  authMiddleware,
  itemController.updateItem);

// 판매글용 이미지 업로더
router.post('/imgUpload', authMiddleware, multerMiddleware.array('item_images', 10), itemController.imgUpload);

module.exports = router;
