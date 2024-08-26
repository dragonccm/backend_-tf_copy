const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    birthday: {
        type: Date,
        unique: true,
        trim: false,
        index: true,
        default: ''
    },
    avt: {
        type: String,
        unique: true,
        trim: false,
        index: true,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    likedPlayLists: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    likedSongs: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    myPlayLists: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    banSongs: {
        type: Array,
        required: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    type_login: {
        type: String,
        trim: true,
        index: true
    },
    token: {
        type: String,
        trim: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});


userSchema.index({ username: 1, email: 1 }, { unique: true });


const User = mongoose.model('User', userSchema);

export default User;