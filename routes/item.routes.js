const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const ItemController = require('../controllers/item.controller');
const itemController = new ItemController();
const multerMiddleware = require('../middlewares/multer');
const multer = require('multer');
const uploadPostPhoto = require('../modules/s3.js');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // 파일이 저장될 경로를 지정합니다.
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     // 파일의 이름을 지정합니다.
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// 사용 예시:
// 이 미들웨어 같은 곳에서 처리하는 건가?
router.post(
  '/upload',
  uploadPostPhoto.single('postImgUrl'),
  itemController.getItems,
  // function (req, res) {
  //   // 파일 업로드 처리 로직을 작성합니다.
  // },
);

// POST : 연습용 판매글 작성
// router.post('/post', authMiddleware, itemController.postItem);

// GET: 게시글 전체 조회
router.get('/', itemController.getItems);

// GET: 게시글 전체 조회 (노인증 테스트)
// router.get('/', itemController.getItemsHS);

// GET: 게시글 상세 조회
router.get('/:item_id', authMiddleware, itemController.getItem);

// DELETE: 판매글 삭제
router.delete('/:item_id', authMiddleware, itemController.deleteItem);

// 판매글 생성
router.post(
  '/',
  authMiddleware,
  multerMiddleware.array('item_images', 10),
  itemController.setItem,
);

// 판매글 수정
router.put('/:item_id', authMiddleware, itemController.updateItem);

module.exports = router;
