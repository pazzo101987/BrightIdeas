const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const secret = process.env.FIRST_SECRET_KEY;
const bcrypt = require('bcrypt')


module.exports = {
    register: async (req, res) => {
        try {
            const potentialUser = await User.findOne({ email: req.body.email })
            if (potentialUser) {
                res.status(400).json({ msg: "Email exists" })
            } else {
                const newUser = await User.create(req.body);
                const userToken = jwt.sign({ _id: newUser.id, email: newUser.email, name: newUser.name, displayName: newUser.displayName }, secret, { expiresIn: "1d" });
                res.cookie("userToken", userToken, { httpOnly: false }).json({ msg: "Create new userToken success!", user: newUser })
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json(err)
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (user) {
                const passwordMatch = await bcrypt.compare(req.body.password, user.password)
                if (passwordMatch) {
                    const userToken = jwt.sign({ _id: user.id, email: user.email, name: user.name, displayName: user.displayName, ideasFavorited: user.ideasFavorited }, secret, { expiresIn: "1d" });
                    res.cookie("userToken", userToken, { httpOnly: false }).json({ msg: "Login success!", user: user })
                } else {
                    res.status(400).json({ message: "Invalid login attempt" })
                }
            } else {
                res.status(400).json({ message: "Invalid login attempt" })
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json(err)
        }
    },
    logout: (req, res) => {
        res.clearCookie("userToken").json({ message: "Logout success!" });
    }
}


module.exports.findAllUsers = (req, res) => {
    User.find()
        .populate("ideasAdded ideasFavorited")
        .then(allUsers => res.json({ user: allUsers }))
        .catch(err => res.status(400).json({ message: "Something went worng finding all users", error: err }))
}
module.exports.findOneUser = (req, res) => {
    User.findById(req.params.id)
        .populate("ideasAdded ideasFavorited")
        .then(oneUser => res.json({ user: oneUser }))
        .catch(err => res.status(400).json({ message: "Something went worng finding a user", error: err }))
}