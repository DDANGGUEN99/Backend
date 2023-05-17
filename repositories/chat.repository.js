const { ChatRooms, Chats, Items, Users } = require('../models');
const { Op } = require('sequelize');

class ChatRepository {
  create = async (chatRoomInfo) => {
    await ChatRooms.create(chatRoomInfo);
  };

  // 안 읽은 채팅 개수를 어떻게 구현하지? 일단 스킵 할까?
  findAllByUser = async (user_id) => {
    return await ChatRooms.findAll({
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Items,
          attributes: ['item_images'],
          limit: 1,
        },
        {
          model: Chats,
          attributes: ['message'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
        {
          model: Users,
          as: 'Buyer',
          attributes: ['user_id', 'nickname'],
          where: { seller_id: user_id },
        },
        {
          model: Users,
          as: 'Seller',
          attributes: ['user_id', 'nickname'],
          where: { buyer_id: user_id },
        },
      ],
    });
  };

  findAllByItem = async (item_id) => {
    return await ChatRooms.findAll({
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Items,
          attributes: ['item_id', 'title'],
          where: { item_id },
        },
      ],
      where: {},
    });
  };
}

module.exports = ChatRepository;
