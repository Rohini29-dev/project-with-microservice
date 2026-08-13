
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const agent = require("../agents/agent");

async function initSocketServer(httpServer) {

  const io = new Server(httpServer, {});

  io.use((socket, next) => {

    const cookies =
      socket.handshake.headers.cookie;

    const { token } =
      cookies
        ? cookie.parse(cookies)
        : {};

    if (!token) {
      return next(
        new Error("Token not found")
      );
    }

    try {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;
      socket.token = token;

      next();

    } catch (error) {

      next(
        new Error("Invalid token")
      );
    }
  });

  io.on("connection", (socket) => {

    console.log("a user connected");

    socket.on(
      "message",
      async (message) => {

        try {


          const response =
            await agent.invoke(
              {
                messages: [
                  {
                    role: "user",
                    content: message,
                  },
                ],
              },
              {
                metadata: {
                  token: socket.token,
                },
              }
            );


          const lastMessage =
            response.messages[
              response.messages.length - 1
            ];

            

          // socket.emit(
          //   "message",
          //   lastMessage.content
          // );

            socket.emit(
  "message",
  {
    type: "text",
    content: lastMessage.content
  }
);

        } catch (error) {

          console.log(
            "SOCKET ERROR:",
            error
          );

         socket.emit("message", {
  type: "text",
  content: error.message,
});
        }
      }
    );
  });
}

module.exports = {
  initSocketServer,
};