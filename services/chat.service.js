const ChatRepository = require('../repositories/chat.repository');
const ItemRepository = require('../repositories/item.repository');
const { Items } = require('../models');
const AppError = require('../utils/appError');

class ChatService {
  chatRepository = new ChatRepository();
  itemRepository = new ItemRepository(Items);

  getChatRoom = async (user_id) => {

    return await this.chatRepository.findAllByUser(user_id);
  }

  getItemChatRoom = async (item_id) => {
    return await this.chatRepository.findAllByItem(item_id);
  }

  postChatRoom = async (chatRoomInfo) => {
    const item = await this.itemRepository.findOne(chatRoomInfo.item_id);
    chatRoomInfo.seller_id = item.user_id;
    await this.chatRepository.create(chatRoomInfo);
  }
}

module.exports = ChatService;
