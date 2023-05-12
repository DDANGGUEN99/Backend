const express = require('express');
const router = express.Router();

// const authMiddleware = require('../middlewares/auth-middleware.js');
const UserController = require('../controllers/user.controller.js');

const userController = new UserController();

// 이메일 중복검사
router.post('/checkEmail', userController.checkEmail);

// 닉네임 중복검사
router.post('/checkNickname', userController.checkNickname);

// 회원가입
router.post('/signup', userController.signup);

// // 회원탈퇴
// router.delete('/withdrawal', authMiddleware, userController.withdrawal);

// // 로그인
// router.post('/login', userController.login);

// // 로그인 테스트
// router.post('/login/test', authMiddleware, userController.authMiddlewareTest);

// // 로그아웃
// router.post('/logout', authMiddleware, userController.logout);

// // 회원정보 조회
// router.get('/profile', authMiddleware, userController.getProfile);

// // 회원정보 수정
// router.put('/profile', authMiddleware, userController.editProfile);

module.exports = router;
