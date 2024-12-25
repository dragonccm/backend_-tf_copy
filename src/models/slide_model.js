const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const slideSchema = new Schema({
    slideId: {
        type: String,
        required: true,
        unique: true
    },
    slideName: {
        type: String,
        required: true,
        unique: true
    },
    slideImage: {
        type: String,
        required: true
    },
    slideDescription: {
        type: String,
        required: true
    },
    playlistId: {
        type: [Schema.Types.ObjectId],
        ref: 'Playlist',
        required: true
    }
});
slideSchema.index({ slideId: 1 });
const Slide = mongoose.model('Slide', slideSchema);
module.exports = Slide;