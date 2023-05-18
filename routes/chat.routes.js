const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const ChatController = require('../controllers/chat.controller');
const chatController = new ChatController();

// GET: 유저 채팅방 조회
router.get('/chatroom', authMiddleware, chatController.getChatRoom);

// GET: 상품 관련 채팅방 조회
router.get('/item/chatroom/:item_id', authMiddleware, chatController.getItemChatRoom);

// POST: 채팅방 생성
router.post('/chatroom', authMiddleware, chatController.postChatRoom);

// GET: 채팅 내용 조회
router.get('/:room_id', authMiddleware, chatController.getChats);

module.exports = router;