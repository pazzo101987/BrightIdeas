const Idea = require("../models/idea.model");
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const secret = process.env.FIRST_SECRET_KEY;


module.exports.findAllIdeas = (req, res) => {
    Idea.find()
        .populate("addedBy favoritedBy")
        .then(allIdeas => res.json({ idea: allIdeas }))
        .catch(err => res.status(400).json({ message: "Something went worng finding all ideas", error: err }))
}
module.exports.findOneIdea = (req, res) => {
    Idea.findById(req.params.id)
        .populate("addedBy favoritedBy")
        .then(oneIdea => res.json({ idea: oneIdea }))
        .catch(err => res.status(400).json({ message: "Something went worng finding one idea", error: err }))
}
module.exports.createIdea = async (req, res) => {
    const { _id } = jwt.verify(req.cookies.userToken, secret)
    const myIdea = new Idea(req.body)
    myIdea.addedBy = _id
    myIdea.favoritedBy.push(_id)
    try {
        let newIdea = await myIdea.save()
        await newIdea.populate("addedBy favoritedBy")
        await User.findByIdAndUpdate(newIdea.addedBy, { $push: { ideasAdded: newIdea._id, ideasFavorited: newIdea._id } })
        res.json({ idea: newIdea })
        // console.log("inside try")
    } catch (err) {
        console.log(`inside catch`, err)
        res.status(400).json({ message: "Something went worng creating a idea", error: err }) //error isnt specific to either try line
    }
}
module.exports.deleteIdea = (req, res) => {
    Idea.findByIdAndDelete(req.params.id)
        .then(result => res.json({ result: result }))
        .catch(err => res.status(400).json({ message: "Something went worng deleting a idea", error: err }))
}
module.exports.favorite = async (req, res) => {
    const { _id } = jwt.verify(req.cookies.userToken, secret)
    try {
        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, { $push: { favoritedBy: _id } }, { new: true })
        await updatedIdea.populate("addedBy favoritedBy")
        await User.findByIdAndUpdate(_id, { $push: { ideasFavorited: req.params.id } })
        res.json({ idea: updatedIdea })
    } catch (err) {
        res.status(400).json({ message: "Something went worng favoriting a idea", error: err }) //error isnt specific to either try line
    }
}
module.exports.unfavorite = async (req, res) => {
    const { _id } = jwt.verify(req.cookies.userToken, secret)
    try {
        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, { $pull: { favoritedBy: _id } }, { new: true })
        await updatedIdea.populate("addedBy favoritedBy")
        await User.findByIdAndUpdate(_id, { $pull: { ideasFavorited: req.params.id } })
        res.json({ idea: updatedIdea })
    } catch (err) {
        res.status(400).json({ message: "Something went worng favoriting a idea", error: err }) //error isnt specific to either try line
    }
}