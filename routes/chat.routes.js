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

// 채팅 내용 저장 예시 - 추후 삭제 예정
const { ChatRooms, Chats, Items, Users, sequelize } = require('../models');
router.post('/chat', authMiddleware, async (req, res) => {
  const { room_id, message } = req.body;
  const { user_id } = res.locals.user;
  console.log(req.body);
  await Chats.create({ ...req.body, user_id });
  res.status(200).json({ message: '채팅 생성함' });
});

module.exports = router;