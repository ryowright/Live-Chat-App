const mongoose = require('mongoose');
require('dotenv').config();

const chatroomSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Chatroom = mongoose.model('Chatroom', chatroomSchema);

module.exports = Chatroom;