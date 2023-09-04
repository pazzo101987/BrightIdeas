const mongoose = require('mongoose');
const { findOneUser } = require('../controllers/user.controller');

const IdeaSchema = new mongoose.Schema({
    idea: {
        type: String,
        required: [true, "Idea is required"],
        minlength: [2, "Idea must be at least 2 characters"]
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Added-By field is required"]
    },
    favoritedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
    { timestamps: true }
);

module.exports = mongoose.model('Idea', IdeaSchema);