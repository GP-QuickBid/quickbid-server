if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

app.use(cors());

app.use(express.json());

app.use(require("./routers"));
app.use(errorHandler);

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
