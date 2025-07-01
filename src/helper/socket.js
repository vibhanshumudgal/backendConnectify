const socket = require("socket.io");
const Chat = require("../model/chat");
const initializesocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: (origin, callback) => {
        callback(null, origin || "*");
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", ({ userId, target_id }) => {
      const room = [userId, target_id].sort().join("_");
      socket.join(room);
    });
    socket.on("sendmessage", async (data) => {
      try {
       
        const { senderId, receiverId, text } = data;

        const room = [senderId, receiverId].sort().join("_");
        // Save to DB
        let chat = await Chat.findOne({
          roomKey : room

        });
        if (!chat) {
          chat = new Chat({
            roomKey : room,
            allMessages: [],
          });
        }

        chat.allMessages.push({
          senderId: senderId,
          receiverId: receiverId,
          text:text,
        });
        await chat.save();
      
        io.to(room).emit("messagerecived", {
          data,
        });
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("typing",({roomId,userName})=>{
      io.to(roomId).emit("isTyping",{typerName: userName});
    })
    socket.on("disconnect", () => {});
  });
};

module.exports = initializesocket;


