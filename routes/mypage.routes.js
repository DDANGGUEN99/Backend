const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware.js');
const UserController = require('../controllers/user.controller.js');
const multerMiddleware = require('../middlewares/multer.js');
const multer = require('multer');

const userController = new UserController();

// // 회원정보 조회
router.get('/', authMiddleware, userController.getProfile);

// // 회원정보 수정
router.put('/', authMiddleware, multerMiddleware.array('user_image', 1), userController.editProfile);

// // 회원탈퇴
router.delete('/', authMiddleware, userController.withdrawal);

module.exports = router;
