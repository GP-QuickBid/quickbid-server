const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const socketAuthentication = async (socket, next) => {
    try {
        let access_token = socket.handshake.query.token;

        if (!access_token) {
            throw { name: "InvalidToken" };
        }

        let payload = verifyToken(access_token);
        let user = await User.findByPk(payload.id);

        if (!user) {
            throw { name: "InvalidToken" };
        }

        // Menambahkan data pengguna ke objek handshake
        socket.handshake.user = {
            id: user.id,
        };
        //cara mengaksesnya
        // const userId = socket.handshake.user.id;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = socketAuthentication;
