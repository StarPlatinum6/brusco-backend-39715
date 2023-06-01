import { Server } from "socket.io";

const socket = {};

socket.connect = (server) => {
  socket.io = new Server(server);

  let { io } = socket;

  io.on("connection", async (socket) => {
    const { productsRepository, messagesRepository } = await import(
      "./repositories/index.js"
    );
    console.log(`Socket ${socket.id} is online!`);

    const products = await productsRepository.getProducts();
    io.emit("products", products);

    socket.on("add-message", async (message) => {
      await messagesRepository.saveMessage(message);
    });

    socket.on("user-auth", async (user) => {
      if (user) {
        socket.broadcast.emit("user-connected", user);
      }
    });
  });
};

export default socket;
