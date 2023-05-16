const ChatRepository = require('../repositories/chat.repository');
const AppError = require('../utils/appError');

class ChatService {
  chatRepository = new ChatRepository();
}

module.exports = ChatService;
