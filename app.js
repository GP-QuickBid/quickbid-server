if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { createServer } = require('http')
const { Server } = require('socket.io')

const express = require("express");
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
})
const { Post, User } = require('./models')

const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const socketAuthentication = require("./middlewares/socketAuthenticate");
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(require("./routers"));
app.use(errorHandler);


// io.use(socketAuthentication)

io.on('connection', (socket) => {
  socket.on('getAllUsers', async () => {
    try {
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ['id', 'fullName', 'email']
        }
      });
      socket.emit('allUsers', posts); // Mengirimkan semua data ke client yang spesifik
      io.emit('allData', posts); // Mengirimkan semua data ke semua client
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  });

  socket.on('createData', async (newData) => {
    try {
      const createdData = await Post.create(newData);
      socket.emit('dataCreated', createdData); // Mengirimkan data yang baru dibuat ke client yang spesifik
      io.emit('allData', await Post.findAll()); // Mengirimkan semua data terbaru ke semua client
    } catch (error) {
      console.log(error);
    }
  });
});

httpServer.listen(3000, () => {
  console.log(`running on port 3000!!`);
});

module.exports = io;
