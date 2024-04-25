const io = require('../app');
const { Post, User } = require('../models');

module.exports = function (socket) {
    console.log("Terhubung dengan " + socket.id);
    
    socket.on('getAllUsers', async () => {
        try {
            const posts = await Post.findAll({
                include: {
                    model: User,
                    attributes: ['id', 'fullName', 'email']
                }
            });
            socket.emit('allPosts', posts);
            console.log("terkirim");
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }); 

    socket.on('createData', async (newData) => {
        try {
            // Simpan data baru ke database
            const createdData = await Post.create(newData);
            // Kirimkan event 'dataCreated' hanya kepada socket pengirimnya
            socket.emit('dataCreated', createdData);
            // Ambil semua data terbaru setelah penambahan data baru
            const posts = await Post.findAll();
            // Kirimkan pembaruan data ke semua klien
           
            io.emit('allData', posts);
        } catch (error) {
            console.log(error);
        }
    });
};
