const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const ChatController = require('../controllers/chat.controller');
const chatController = new ChatController();

router.get('/');

module.exports = router;
