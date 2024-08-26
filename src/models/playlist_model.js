const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlistSchema = new Schema({
    playlistId: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
    },
    playlistname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    genresid: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    artistsId: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: { //Sửa lại trường 'desciption' thành 'description'
        type: String,
        required: true,
        trim: true,
    },
    songid: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    like: {
        type: Number,
        required: true,
        min: 0,
        default: 0
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
        default:0,
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

playlistSchema.index({ playlistname: 'text' });

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;