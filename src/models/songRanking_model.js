const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const songRankingSchema = new Schema({

    rankingDate: {
        type: Date,
        default: Date.now
    },
    songId: {
        type: String,
        ref: 'Song',
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
    },
    rankWeek: {
        type: Number,
        default: 0
    }
});
songRankingSchema.index({ songId: 1 });

const SongRanking = mongoose.model('SongRanking', songRankingSchema);

module.exports = SongRanking;