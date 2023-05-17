const ChatService = require('../services/chat.service');

class ChatController {
  chatService = new ChatService();

  // 본인의 user_id가 selle_id 혹은 buyer_id인 것을 찾는다.
  getChatRoom = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const rooms = await this.chatService.getChatRoom(user_id);
      res.status(200).json({ rooms });
    } catch (error) {
      next(error, req, res, '채팅방 조회에 실패했습니다.');
    }
  };

  getItemChatRoom = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const rooms = await this.chatService.getItemChatRoom(item_id);
      res.status(200).json({ rooms });
    } catch (error) {
      next(error, req, res, '채팅방 조회에 실패했습니다.');
    }
  };

  postChatRoom = async (req, res, next) => {
    try {
      const buyer_id = res.locals.user.user_id;
      const chatRoomInfo = { ...req.body, buyer_id }; // req.body == { item_id }
      await this.chatService.postChatRoom(chatRoomInfo);
      res.status(200).json({ message: '채팅방을 생성했습니다. '});
    } catch (error) {
      next(error, req, res, '채팅방 생성에 실패했습니다.');
    }
  };
}

module.exports = ChatController;
