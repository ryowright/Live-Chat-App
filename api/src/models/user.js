const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: [2, 'Username is too short']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Password is too short']
    },
    incomingFriendRequests: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    pendingFriendRequests: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('chatrooms', {
    ref: 'Chatroom',
    localField: '_id',
    foreignField: 'users.user'
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'livechatapp', { expiresIn: '1 day'});

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;