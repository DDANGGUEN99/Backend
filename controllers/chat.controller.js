const ChatService = require('../services/chat.service');

class ChatController {
  chatService = new ChatService();


}

module.exports = ChatController;
