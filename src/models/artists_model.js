const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArtistsSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    artistsName: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,

    },
    alias: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    biography: {
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    avt: {
        type: String,
        default: ''
    },
    birthday: {
        type: String,
        index: true
    },
    realName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    totalFollow: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    songListId: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    playListId: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    state: {
        type: Number,
        required: true,
        trim: true,
        default:0
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


ArtistsSchema.index({ id: 1, ArtistsName: 1 }, { unique: true });
ArtistsSchema.index({ ArtistsName: 'text' });



const Ar = mongoose.model('Artists', ArtistsSchema);

module.exports = Ar;