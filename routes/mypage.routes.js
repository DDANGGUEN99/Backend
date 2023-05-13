const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware.js');
const UserController = require('../controllers/user.controller.js');

const userController = new UserController();

// // 회원정보 조회
router.get('/', authMiddleware, userController.getProfile);

// // 회원정보 수정
router.put('/', authMiddleware, userController.editProfile);

// // 회원탈퇴
router.delete('/', authMiddleware, userController.withdrawal);

module.exports = router;
