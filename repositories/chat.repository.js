const { ChatRooms, Chats, Items, Users, ChatDetails } = require('../models');
const { Op } = require('sequelize');

class ChatRepository {
  create = async (chatRoomInfo) => {
    const chatRoom = await ChatRooms.create(chatRoomInfo);
    console.log(chatRoom);
    // chatDetail 생성
    await ChatDetails.create(chatRoomInfo.buyer_id, chatRoom.dataValues.room_id);
    await ChatDetails.create(chatRoomInfo.seller_id, chatRoom.dataValues.room_id);
  };

  // 안 읽은 채팅 개수를 어떻게 구현하지? 일단 스킵 할까?
  findAllByUser = async (user_id) => {
    return await ChatRooms.findAll({
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Items,
          attributes: ['item_images'],
        },
        {
          model: Chats,
          attributes: ['message'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
        {
          model: Users,
          as: 'Seller',
          attributes: ['nickname', 'user_image'],
        },
        {
          model: Users,
          as: 'Buyer',
          attributes: ['nickname', 'user_image'],
        }
      ],
      where: { [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }], },
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
        {
          model: Chats,
          attributes: ['message'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
        {
          model: Users,
          as: 'Buyer',
          attributes: ['nickname', 'user_image'],
        }
      ],
      where: {},
    });
  };
}

module.exports = ChatRepository;