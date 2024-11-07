const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

// REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Input validation (basic example)
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(200).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});


//Login

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(password,user.password)
        !validPassword && res.status(400).json("Wrong password")

        res.status(200).json(user)
    }
    catch(err){ 
        console.error(err);
        res.status(500).json({ message: "Error login user" });
    }
})



module.exports = router;
