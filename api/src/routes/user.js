const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if(!user || !isMatch) {
            return res.status(401).send({ error: 'Incorrect Username and/or Password.' });
        }

        const token = await user.generateAuthToken();
        res.status(200).send({ message: 'Login successful', token });
    } catch(e) {
        res.status(500).send({ error: 'Error fetching user from database.' });
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();

        res.status(200).send({ message: 'Logout successful.' });
    } catch(e) {
        res.status(500).send({ error: 'Unable to logout users.' });
    }
})

router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send({ message: 'Successfully logged out all users.' });
    } catch(e) {
        res.status(500).send({ error: 'Unable to logout all users.' });
    }
})

router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const dupUsername = await User.findOne({ username: req.body.username });
        const dupEmail = await User.findOne({ email: req.body.email });

        if(dupUsername) {
            return res.status(400).send({ error: 'Username is taken.' });
        }

        if(dupEmail) {
            return res.status(400).send({ error: 'Email is taken.' });
        }

        const token = await user.generateAuthToken();
        await user.save()
        res.status(201).send({ message: 'Successfully registered!', token });
    } catch(e) {
        res.status(500).send({ error: 'Unable to register user.' });
    }
})

router.post('/send-friend-request', auth, async (req, res) => {
    try {
        const userToFriend = await User.findOne({ username: req.body.username });

        if(!userToFriend) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Don't allow sending of more than one friend request
        if(userToFriend.incomingFriendRequests.includes(req.user._id) || req.user.pendingFriendRequests.includes(userToFriend._id)) {
            return res.status(400).send({ error: 'There is already a pending friend request for this user.' });
        }

        req.user.pendingFriendRequests = req.user.pendingFriendRequests.concat(userToFriend._id);
        userToFriend.incomingFriendRequests = userToFriend.incomingFriendRequests.concat(req.user._id);

        await req.user.save();
        await userToFriend.save();
        res.status(200).send({ message: 'Friend request sent successfully.' });
    } catch(e) {
        res.status(500).send({ error: 'Failed to send friend request.' });
    }
})

router.post('/accept-friend-request', auth, async (req, res) => {
    try {
        const userToFriend = await User.findOne({ username: req.body.username });

        if(!userToFriend) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Don't allow accept if no friend request exists
        if(!req.user.incomingFriendRequests.includes(userToFriend._id) || !userToFriend.pendingFriendRequests.includes(req.user._id)) {
            return res.status(404).send({ error: 'No friend request was sent by this user.' });
        }

        req.user.friends = req.user.friends.concat(userToFriend._id);
        req.user.incomingFriendRequests = req.user.incomingFriendRequests.filter((request) => request !== userToFriend._id);
        userToFriend.friends = userToFriend.friends.concat(req.user._id);
        userToFriend.pendingFriendRequests = userToFriend.pendingFriendRequests.filter((request) => request !== req.user._id);

        await req.user.save();
        await userToFriend.save();
    } catch(e) {
        res.status(500).send({ error: 'Unable to accept friend request.' });
    }
})

router.post('/decline-friend-request', auth, async (req, res) => {
    try {
        const userToFriend = await User.findOne({ username: req.body.username });

        if(!userToFriend) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Don't allow decline if no friend request exists
        if(!req.user.incomingFriendRequests.includes(userToFriend._id) || !userToFriend.pendingFriendRequests.includes(req.user._id)) {
            return res.status(404).send({ error: 'No friend request was sent by this user.' });
        }

        req.user.incomingFriendRequests = req.user.incomingFriendRequests.filter((request) => request !== userToFriend._id);
        userToFriend.pendingFriendRequests = userToFriend.pendingFriendRequests.filter((request) => request !== req.user._id);

        await req.user.save();
        await userToFriend.save();
    } catch(e) {
        res.status(500).send({ error: 'Unable to decline friend request.' });
    }
})

router.post('/cancel-friend-request', auth, async (req, res) => {
    try {
        const userToFriend = await User.findOne({ username: req.body.username });

        if(!userToFriend) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Don't allow cancel if no friend request has been sent
        if(!req.user.pendingFriendRequests.includes(userToFriend._id) || !userToFriend.incomingFriendRequests.includes(req.user._id)) {
            return res.status(404).send({ error: 'You have not sent a friend request to this user.' });
        }

        req.user.pendingFriendRequests = req.user.pendingFriendRequests.filter((request) => request !== userToFriend._id);
        userToFriend.pendingFriendRequests = userToFriend.pendingFriendRequests.filter((request) => request !== req.user._id);

        await req.user.save();
        await userToFriend.save();
    } catch(e) {
        res.status(500).send({ error: 'Unable to cancel friend request.' });
    }
})

router.post('/remove-friend', auth, async (req, res) => {
    try {
        const userToRemove = await User.findOne({ username: req.body.username });

        if(!userToRemove) {
            return res.status(404).send({ error: 'User not found.' });
        }

        if(!req.user.friends.includes(userToRemove._id) || !userToRemove.friends.includes(req.user._id)) {
            return res.status(404).send({ error: 'You are not currently friends with this user.' });
        }

        req.user.friends = req.user.friends.filter((friend) => friend !== userToRemove._id);
        userToRemove.friends = userToRemove.friends.filter((friend) => friend !== req.user._id);

        await req.user.save();
        await userToRemove.save();
    } catch(e) {
        res.status(500).send({ error: 'Unable to remove friend.' });
    }
})


router.delete('/me', auth, async (req, res) => {
    try {
        const isMatch = await bcrypt.compare(req.body.password, req.user.password);

        if(!isMatch) {
            return res.status(401).send({ error: 'Incorrect Password.' });
        }

        await req.user.remove();
        res.status(200).send({ message: 'Your account has been successfully deleted.' });
    } catch(e) {
        res.status(500).send({ error: 'Failed to delete user.' });
    }
})


// ROUTES USED FOR TESTING WITH POSTMAN
router.get('/pending-friend-requests', auth, async (req, res) => {
    res.send(req.user.pendingFriendRequests);
})

router.get('/incoming-friend-requests', auth, async (req, res) => {
    res.send(req.user.incomingFriendRequests);
})

router.get('/friends', auth, async (req, res) => {
    res.send(req.user.friends);
})

// router.delete('/delete-all', async (req, res) => {
//     try {
//         await User.deleteMany();
//         res.status(200).send('Delete all users successful.');
//     } catch(e) {
//         res.status(500).send('Unable to delete all users');
//     }
// })

// GET USER
router.get('/me', auth, async (req, res) => {  
    res.status(200).send({
        username: req.user.username,
        email: req.user.email,
    });
});

module.exports = router;