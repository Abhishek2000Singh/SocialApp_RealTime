const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');


//update user
router.put('/:id', async (req, res) => {
    const { userId, password } = req.body;
    if (userId === req.params.id || req.body.isAdmin) {
        if (password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json({ message: "Account has been updated successfully", user })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating account" });
        }
    } else {
        return res.status(403).json({ message: "You can only update your own account" })
    }
})



//delete user
router.delete('/:id', async (req, res) => {
    const { userId } = req.body;
    if (userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Account has been deleted successfully", user })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting account" });
        }
    } else {
        return res.status(403).json({ message: "You can only delete your own account" })
    }
})


//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});


//Getting friends 
router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId)
            })
        )
        let friendList = []
        friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture })
        })
        res.status(200).json(friendList)
    } catch (error) {
        res.status(500).json(error)
    }
})


//follow user
router.put('/:id/follow', async (req, res) => {
    const { userId } = req.body
    if (userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(userId)
            if (!user.followers.includes(userId)) {
                await user.updateOne({ $push: { followers: userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })
                res.status(200).json({ message: "User has been followed" });
            } else {
                res.status(403).json({ message: "You already follow this user" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server error" })
        }
    } else {
        res.status(403).json({ message: "you can't follow yourself" })
    }
})


// unfollow user
router.put('/:id/unfollow', async (req, res) => {
    const { userId } = req.body
    if (userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(userId)
            if (user.followers.includes(userId)) {
                await user.updateOne({ $pull: { followers: userId } })
                await currentUser.updateOne({ $pull: { following: req.params.id } })
                res.status(200).json({ message: "User has been unfollowed" });
            } else {
                res.status(403).json({ message: "You don't follow this user" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server error" })
        }
    } else {
        res.status(403).json({ message: "you can't unfollow yourself" })
    }
})




module.exports = router;