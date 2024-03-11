const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        pic: {
            type: String,
            default: 'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg',

        },
        // friends: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        // }],
        // chats: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Chat',
        // }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);