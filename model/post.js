const mongoose = require('mongoose');
const { string } = require('three/tsl');

const postSchema = new mongoose.Schema({
    userName: {
        type: String, // duplicated for convenience
        required: true,
    },
    fileUlr: {
        type: String,
        require: true

    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageData',
        required: true
    },

    like: [{ type: mongoose.Schema.Types.ObjectId }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);