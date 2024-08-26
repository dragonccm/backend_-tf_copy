const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new Schema({
    genreId: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
    },
    genrename: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    thumbnailHasText: {
        type: String,
        required: true
    },
    thumbnailR: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    playListId: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    listen: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    state: {
        type: Number,
        required: true,
        trim: true,
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

const genre = mongoose.model('genre', genreSchema);

module.exports = genre;
