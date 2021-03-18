const express = require('express');
const Chatroom = require('../models/chatroom');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// CREATE CHATROOM WITH USERS
router.post('/create-chatroom', auth, async (req, res) => {
    const chatroom = new Chatroom({
        name: req.body.name,
        owner: req.user._id,
        users: [req.user._id]
    });

    try {
        await chatroom.save();

        res.status(201).send({ message: 'Chatroom succesfully created.' });
    } catch(e) {
        res.status(500).send({ error: 'Unable to create chatroom.' });
    }
})

// ADD FRIENDS TO CHATROOM
router.post('/join-chatroom', auth, async (req, res) => {
    try {
        const chatRoom = await Chatroom.findOne({name: req.body.name});
        if(req.user._id !== chatRoom.owner && !chatRoom.users.includes(req.user._id)) {
            chatRoom.users.push(req.user._id);
            await chatRoom.save();
        }

        res.status(200).send({ message: 'Chatroom succesfully joined.' });
    } catch(e) {
        res.status(500).send({ error: 'Unable to join chatroom.' });
    }
})

// LEAVE CHATROOM GROUP
router.delete('/all-chatrooms', auth, async (req, res) => {
    try {
        await Chatroom.deleteMany({ owner: req.user._id });

        res.status(200).send({ message: 'Succesfully deleted all chatrooms' });
    } catch(e) {
        res.status(500).send({ error: 'Failed to delete all chatrooms.' });
    }
})

module.exports = function(io) {
    io.on("connection", (socket) => {
        socket.on('join', async ({ roomName, username }) => {
            socket.join(roomName);

            // Send user welcome message upon joining room
            socket.emit('broadcast message', 'Welcome to the chatroom!');

            // Let other room users know that someone has joined
            socket.broadcast.to(roomName).emit('broadcast message', `${username} has joined the chatroom!`);
        
        });

        socket.on('chat message', (msg, roomName, username) => {
            io.to(roomName).emit('chat message', msg, username);
        });

        socket.on("disconnect", () => {
            socket.emit('broadcast message', `User has left the chatroom.`)
        });
    });

    return router;
};