const { ChatRooms, Chats, Items, Users, ChatDetails } = require('../models');
const { Op } = require('sequelize');

class ChatRepository {
  create = async (chatRoomInfo) => {
    const chatRoom = await ChatRooms.create(chatRoomInfo);
    console.log(chatRoom);
    // chatDetail 생성
    console.log(chatRoom.dataValues.room_id);
    console.log(chatRoomInfo.buyer_id);
    console.log(chatRoomInfo.seller_id);
    // await ChatDetails.create({
    //   room_id: chatRoom.dataValues.room_id,
    //   user_id: chatRoomInfo.buyer_id
    // });
    // await ChatDetails.create({
    //   room_id: chatRoom.dataValues.room_id,
    //   user_id: chatRoomInfo.seller_id
    // });
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
        },
      ],
      where: { [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }] },
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
        },
      ],
      where: {},
    });
  };

  findAllChats = async (room_id) => {
    return await ChatRooms.findAll({
      where: { room_id },
    });
  };
}

module.exports = ChatRepository;
