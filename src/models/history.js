const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    SongHistory: {
        type: Array,
        required: true,
        trim: true,
        index: true,
    },
    PlaylistHistory: {
        type: Array,
        required: true,
        trim: true,
        index: true,
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

const History = mongoose.model('History', historySchema);

module.exports = History;