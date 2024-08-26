const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const playlistRankingSchema = new Schema({

    rankingDate: {
        type: Date,
        default: Date.now
    },
    playlistId: {
        type: String,
        ref: 'Playlist',
        required: true
    },
    listenCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    }
});
playlistRankingSchema.index({ playlistId: 1 });

const PlaylistRanking = mongoose.model('PlaylistRanking', playlistRankingSchema);

module.exports = PlaylistRanking;
