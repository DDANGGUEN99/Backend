const { ChatRooms, Chats, Items, Users, sequelize } = require('../models');

class AppSocket {
  saveChat = async (chat) => {
    console.log(chat);
    await Chats.create({ ...chat });
  }

  confirmChat = async () => {

  }

}

module.exports = AppSocket;