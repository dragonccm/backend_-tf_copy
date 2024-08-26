const mongoose = require('mongoose');
const { Schema } = mongoose;

const likes_store = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    songid: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const likes = mongoose.model('likes', likes_store);

module.exports = likes;