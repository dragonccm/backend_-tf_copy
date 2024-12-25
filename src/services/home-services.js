import { getPlaylist } from "./history-services";
import { getPlaylistRankMonth } from "./rankCliend.js";
import Song from "../models/sonng_model.js";
import Playlist from "../models/playlist_model.js";
import Ar from "../models/artists_model.js";
const getNewRelease = async () => {
  try {
    const [vPop, others, all] = await Promise.all([
      Song.find({
        $and: [
          { genresid: { $elemMatch: { $eq: "IWZ9Z087" } } },
          { state: { $ne: 1 } }
        ]
      }).select("artists id songname thumbnail").limit(12),
      // Song.aggregate([
      //   {
      //     $sort: { createdAt: -1 }, // Thêm điều kiện sort
      //   },
      //   {
      //     $match: {
      //       genresid: { $elemMatch: { $eq: "IWZ9Z087" } },
      //       state: { $ne: 1 },
      //     },
      //   },
      //   {
      //     $unwind: "$artists",
      //   },
      //   {
      //     $lookup: {
      //       from: "artists",
      //       localField: "artists",
      //       foreignField: "id",
      //       as: "artistInfo",
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         id: "$id",
      //         songname: "$songname",
      //         thumbnail: "$thumbnail",
      //       },
      //       artists: { $addToSet: { $arrayElemAt: ["$artistInfo", 0] } },
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       id: "$_id.id",
      //       songname: "$_id.songname",
      //       thumbnail: "$_id.thumbnail",
      //       artists: 1,
      //     },
      //   },
      // ]).limit(12),
      Song.find({
        $and: [
          { genresid: { $in: ['IWZ9Z086','IWZ9Z08U'] } },
          { state: { $ne: 1 } }
        ],
      }).select("artists id songname thumbnail").limit(12),
      // Song.aggregate([
      //   {
      //     $sort: { createdAt: -1 }, // Thêm điều kiện sort
      //   },
      //   {
      //     $match: {
      //       $and: [
      //         {
      //           state: { $ne: 1 },
      //           genresid: { $in: ["IWZ9Z086", "IWZ9Z08U"] },
      //         },
      //       ],
      //     },
      //   },

      //   {
      //     $unwind: "$artists", // Mở rộng mảng artists
      //   },
      //   {
      //     $lookup: {
      //       from: "artists", // Tên collection Artists
      //       localField: "artists", // Trường chứa id nghệ sĩ trong collection Song
      //       foreignField: "id", // Trường _id trong collection Artists
      //       as: "artistInfo",
      //     },
      //   },
      //   {
      //     $unwind: "$artistInfo",
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         id: "$id",
      //         songname: "$songname",
      //         thumbnail: "$thumbnail",
      //       },
      //       artists: { $addToSet: "$artistInfo" }, // Gom các nghệ sĩ vào một mảng
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       id: "$_id.id",
      //       songname: "$_id.songname",
      //       thumbnail: "$_id.thumbnail",
      //       artists: 1,
      //     },
      //   },
      // ]).limit(12),
      Song.find({ state: { $ne: 1 } })
        .sort({ createdAt: -1 })
        .select("artists id songname thumbnail")
        .limit(12),
      // Song.aggregate([
      //   {
      //     $sort: { createdAt: -1 }, // Thêm điều kiện sort
      //   },
      //   {
      //     $match: {
      //       $and: [
      //         {
      //           state: { $ne: 1 },
      //           // genresid: { $in: ["IWZ9Z086", "IWZ9Z08U"] },
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     $unwind: "$artists", // Mở rộng mảng artists
      //   },
      //   {
      //     $lookup: {
      //       from: "artists", // Tên collection Artists
      //       localField: "artists", // Trường chứa id nghệ sĩ trong collection Song
      //       foreignField: "id", // Trường _id trong collection Artists
      //       as: "artistInfo",
      //     },
      //   },
      //   {
      //     $unwind: "$artistInfo",
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         id: "$id",
      //         songname: "$songname",
      //         thumbnail: "$thumbnail",
      //       },
      //       artists: { $addToSet: "$artistInfo" }, // Gom các nghệ sĩ vào một mảng
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       id: "$_id.id",
      //       songname: "$_id.songname",
      //       thumbnail: "$_id.thumbnail",
      //       artists: 1,
      //     },
      //   },
      // ]).limit(12),
    ])

    const populateArtists = async (songs) => {
      return Promise.all(songs.map(async (song) => {
        const artists = await Ar.find({ id: { $in: song.artists } });
        return { ...song._doc, artists };
      }));
    };

    const newRelease = {
      all: await populateArtists(all),
      vPop: await populateArtists(vPop),
      others: await populateArtists(others)
    };
    // const newRelease = {
    //   all,
    //   vPop,
    //   others,
    // };
    return newRelease;
  } catch (error) {
    console.error("Error fetching new releases:", error);
    throw error;
  }
};

const getSongHot = async () => {
  const songHot = await Playlist.find({ state: { $ne: 1 } })
    .sort({ listen: -1 })
    .select("playlistname playlistId description thumbnail")
    .limit(5);
  return songHot;
};

const getSongRemix = async () => {
  const songRemix = await Playlist.find({
    genresid: { $in: ["IWZ9Z0BO", "IWZ9Z08B", "IWZ9Z08C"] },
    state: { $ne: 1 },
  })
    .select("playlistname playlistId description thumbnail")
    .sort({ listen: -1 })
    .limit(5);
  return songRemix;
};

const getSongChill = async () => {
  const songChill = await Playlist.find({
    genresid: { $in: ["IWZ9Z089", "IWZ9Z09B", "IWZ9Z096"] },
    state: { $ne: 1 },
  })
    .select("playlistname playlistId description thumbnail")
    .sort({ listen: -1 })
    .limit(5);
  return songChill;
};

const getSongSad = async () => {
  const songSad = await Playlist.find({
    genresid: { $in: ["IWZ9Z099"] },
    state: { $ne: 1 },
  })
    .select("playlistname playlistId description thumbnail")
    .sort({ listen: -1 })
    .limit(5);
  return songSad;
};

const getSongRating = async () => {
  const data = await getPlaylistRankMonth();
  // const songRating = await Song.find({ state: { $ne: 1 } }).select("artists id songname thumbnail")
  //   .sort({ listen: -1, createdAt: -1 })
  //   .limit(8);
  return data.DT.NowPlaylist.songs.slice(0, 9);
};

const getSongTop100 = async () => {
  const songTop100 = await Playlist.find({
    playlistname: { $regex: "Top 100", $options: "i" },
    state: { $ne: 1 },
  })
    .select("playlistname playlistId description thumbnail")
    .sort({ listen: -1 })
    .limit(5);
  return songTop100;
};

const getAlbumHot = async () => {
  const albumHot = await Playlist.find({
    type: "album",
    state: { $ne: 1 },
  })
    .select("playlistname playlistId description thumbnail")
    .sort({ listen: -1 })
    .limit(5);
  return albumHot;
};

module.exports = {
  getNewRelease,
  getSongHot,
  getSongRemix,
  getSongChill,
  getSongTop100,
  getAlbumHot,
  getSongRating,
  getSongSad,
};
