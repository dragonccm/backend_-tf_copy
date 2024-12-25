const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  songname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  thumbnail: {
    type: String,
    required: true,
    default: "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/3/2/a/3/32a35f4d26ee56366397c09953f6c269.jpg",
  },
  alias: {
    type: String,
    trim: true,
    index: true,
  },
  artists: {
    type: [String], // Ensure this is an array of strings
    required: true,
    trim: true,
    index: true,
  },
  genresid: {
    type: Array,
    required: true,
    trim: true,
    index: true,
  },
  like: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  listen: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  lyric: [
    {
      words: [
        {
          startTime: { type: Number },
          endTime: { type: Number },
          data: { type: String },
        },
      ],
    },
  ],
  songLink: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    trim: true,
  },
  state: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  // ranking: {
  //   type: Schema.Types.ObjectId, // Sử dụng ObjectId để tạo liên kết với SongRanking
  //   ref: 'SongRanking', // Xác định model liên kết là SongRanking
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

songSchema.index({ songname: 'text' });
const Song = mongoose.model("Song", songSchema);

module.exports = Song;
