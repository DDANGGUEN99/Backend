const { io } = require("./app");

io.on("connection", (socket) => {
  console.log("New client connected");

  // 여기서부터 이벤트 핸들러 등록

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});