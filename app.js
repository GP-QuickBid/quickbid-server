if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
// const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const router = require("./routers");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(router)

app.use(require("./routers"));
app.use(errorHandler);

// io.on("connection", (socket) => {
//   // ...
// });

httpServer.listen(3000, () => {
  console.log(`running on port 3000!!`);
});

module.exports = {app, io};
