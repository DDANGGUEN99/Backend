const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const ItemController = require('../controllers/item.controller');
const itemController = new ItemController();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일이 저장될 경로를 지정합니다.
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 파일의 이름을 지정합니다.
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// 사용 예시:
router.post('/upload', upload.single('postImgUrl'), function(req, res) {
  // 파일 업로드 처리 로직을 작성합니다.
});


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
  authMiddleware,
  upload.single('postImgUrl'),
  itemController.createPost.bind(itemController) // bind를 사용하여 올바른 콜백 함수를 전달합니다.
);


// 판매글 수정
router.put(
  '/items/:item_id',
  authMiddleware,
  upload.single('postImgUrl'),
  itemController.updatePost
);



// 판매글 상태 수정
router.put('/items/:item_id', authMiddleware, itemController.updateStatus);

module.exports = router;
