if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { createServer } = require("http");
const { Server } = require("socket.io");

const express = require("express");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://gp-quickbid.web.app"],
  },
});
const { Post, User } = require("./models");

const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const socketAuthentication = require("./middlewares/socketAuthenticate");
const { log } = require("console");

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(require("./routers"));
app.use(errorHandler);

// io.use(socketAuthentication)

io.on("connection", (socket) => {
  socket.on("getAllUsers", async () => {
    try {
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ["id", "fullName", "email"],
        },
        order: [["id", "ASC"]],
      });
      socket.emit("allUsers", posts); // Mengirimkan semua data ke client yang spesifik
      io.emit("allData", posts); // Mengirimkan semua data ke semua client
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  });

  socket.on("bidPost", async (id) => {
    try {
      const post = await Post.findByPk(id);
      const newPrice = post.price + 10000;
      await post.update({ price: newPrice });
      io.emit("postBid", { id, price: newPrice });
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ["id", "fullName", "email"],
        },
        order: [["id", "ASC"]],
      });
      io.emit("dataBaru", posts);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("deletePost", async (id) => {
    try {
      // Hapus post dari database
      await Post.destroy({ where: { id } });

      // Emit event delete ke semua client untuk memperbarui tampilan
      io.emit("postDeleted", id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`running on port ${port}!!`);
});

module.exports = io;
