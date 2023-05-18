const express = require('express');
const app = express();
var cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const AppSocket = require('./socket/socket');
const appSocket = new AppSocket();

require('dotenv').config();
const port = process.env.HOST_PORT;

const cookieParser = require('cookie-parser');
const router = require('./routes');

// cors
// app.use(cors());
app.use(
  cors({
    origin: '*',
    credentials: 'true',
    // cors options
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

server.listen(port, () => {
  console.log(`running ${port}`);
});

// socket.id들을 저장해 둘 자료구조.
const chatRooms = new Map();

// 클라이언트와 소켓 연결
io.on('connection', (socket) => {
  console.log('User connected' + socket.id);

  // 채팅방 입장 이벤트
  socket.on('room_enter', (enterData) => {
    const { room_id, user_id } = enterData;
    if (chatRooms.has(room_id)) {
      // room_id의 채팅방이 존재하는 경우
      chatRooms.get(room_id).set(user_id, socket.id);
    } else {
      // room_id의 채팅방이 존재하지 않는 경우
      const socketMap = new Map();
      socketMap.set(user_id, socket.id);
      chatRooms.set(room_id, socketMap);
    }
  });

  // 읽음 처리 이벤트
  socket.on('confirm', (confirmData) => {
    appSocket.confirmChat(confirmData);
    const chatRoom = chatRooms.get(confirmData.room_id);
    for (const key in chatRoom) {
      io.to(chatRoom[key]).emit('confirm', confirmData);
    }
  });

  // 해당 방 안의 애들한테만 메세지 전송하기
  socket.on('message', (message) => {
    appSocket.saveChat(message);
    const chatRoom = chatRooms.get(message.room_id);
    for (const key in chatRoom) {
      io.to(chatRoom[key]).emit('message', message);
    }
  });

  socket.on('disconnect', (room_id, user_id) => {
    console.log('유저 나갔다');
    // 방 자료구조에서 나가는 구조 짜기.
    // 만약 다 나갔으면 방도 없애주면 좋을 것 같다.
    chatRooms.get(room_id).delete(user_id);
  });
});

module.exports = app;