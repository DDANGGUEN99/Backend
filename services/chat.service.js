const ChatRepository = require('../repositories/chat.repository');
const ItemRepository = require('../repositories/item.repository');
const { Items } = require('../models');
const AppError = require('../utils/appError');
const chatrooms = require('../models/chatrooms');

class ChatService {
  chatRepository = new ChatRepository();
  itemRepository = new ItemRepository(Items);

  getChatRoom = async (user_id) => {
    const chatRooms = await this.chatRepository.findAllByUser(user_id);
    const mapChatRooms = chatRooms.map((chatRoom) => {

      if (!chatRoom.dataValues.Chats[0].message) {
        // console.log('이미지 null 일 때');
        chatRoom.dataValues.last_chat = null;
      } else {
        // console.log('이미지 있을 때');
        chatRoom.dataValues.last_chat = chatRoom.dataValues.Chats[0].message;
      }

      if (!chatRoom.dataValues.Item.item_images) {
        // console.log('이미지 null 일 때');
        chatRoom.dataValues.thumbnail_url = null;
      } else {
        // console.log('이미지 있을 때');
        chatRoom.dataValues.thumbnail_url = chatRoom.dataValues.Item.item_images.split(',',2,)[0];
      }

      // opposite_nickname 구하기
      if (user_id == chatRoom.dataValues.seller_id) {
        // 사용자는 판매자.
        chatRoom.dataValues.opposite_nickname = chatRoom.dataValues.Seller.nickname;
      } else {
        chatRoom.dataValues.opposite_nickname = chatRoom.dataValues.Buyer.nickname;
      }

      delete chatRoom.dataValues.Chats;
      delete chatRoom.dataValues.Item;
      delete chatRoom.dataValues.Seller;
      delete chatRoom.dataValues.Buyer;
      
      return chatRoom;
    });
    console.log(mapChatRooms);
    return mapChatRooms;
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
