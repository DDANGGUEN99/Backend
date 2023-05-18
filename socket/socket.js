class AppSocket {
  saveChat = async (message) => {
    const obj = JSON.parse(message);
    console.log('user_id', obj.user_id);
    console.log('room_id', obj.room_id);
    console.log('message', obj.message);
  }

  confirmChat = async () => {

  }

}

module.exports = AppSocket;