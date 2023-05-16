const express = require('express');
const app = express();
var cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

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

// 채팅이 들어온다는 것은 어떤 의미일까?
io.on('connection', (socket) => {
  console.log('User connected' + socket.id);

  socket.on('disconnect', () => {
    console.log('유저 나갔다');
  });

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});

module.exports = app;
