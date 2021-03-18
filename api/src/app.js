require('./db/mongoose');
const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');
const chatroomRouter = require('./routes/chatroom')(io);

// app.use(express.static(path.join(__dirname, '../../dist')));

// Only parses and allows json requests
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/chatroom', chatroomRouter);

module.exports = http;