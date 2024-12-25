const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    songId: {
        type: "string",
        ref: 'Song',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    parentId: {
        type: String,
        default: undefined,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ban: {
        type: Array,
        default: []
    },
    reportCount: {
        type: Number,
        default: 0
    },
    state: {
        type: Number,
        default: 0
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;