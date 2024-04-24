const express = require("express");
const router = express.Router();

//HOME
router.get("/", (req, res) => {
  res.status(200).json("Welcome to QuickBid API");
});

//USER
router.use("/", require("./userRoute"));

//POST
router.use("/post", require("./postRoute"))

module.exports = router;
