const Ar = require("../models/artists_model");

const infoArtist = async (id) => {
  const data = await Ar.aggregate([
    { $match: { alias: id } },
    {
      $lookup: {
        from: "songs",
        localField: "songListId",
        foreignField: "id",
        pipeline: [
          { $project: { id: 1 , songname: 1, thumbnail: 1, id: 1, duration: 1 } },
        ],
        as: "songListId",
        let: { songListId: "$songListId" },
        pipeline: [
          {
            $match: {
              "state": { $ne: 1 },
            },
          },
          {
            $lookup: { // Thêm stage lookup cho artist
              from: "artists",
              localField: "artists",
              foreignField: "id",
              as: "artist_info",
            },
          },
          {
            $project: { // Chỉ giữ lại id và thumbnail
              _id: 0,
              id: 1,
              thumbnail: 1,
              songname: 1,
              artists: { $ifNull: ["$artist_info", []] },
              duration: 1,
            }
          }
        ],
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "playListId",
        foreignField: "playlistId",
        as: "playListId",
      },
    },
    {
      $lookup: {
        from: "playlists",
        let: { artistId: "$id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$artistId", "$artistsId"] }, type: "playlist" } },
          { $project: { playlistname: 1, thumbnail: 1, playlistId: 1 } },
        ],
        as: "playlistJoin",
      },
    },
    {
      $lookup: {
        from: "artists",
        let: { songListId: "$songListId" },
        pipeline: [
          { $match: { $expr: { $in: ["$id", "$$songListId.id"] }, id: { $ne: "$id" } } },
          { $project: { artistsName: 1, id: 1, avt: 1, totalFollow: 1, alias: 1 } },
        ],
        as: "relatedArtists",
      },
    },
    {
      $project: {
        artistsName: 1,
        id: 1,
        biography: 1,
        birthday: 1,
        playListId: 1,
        realName: 1,
        avt: 1,
        songListId: { $first: "$songListId" },
        totalFollow: 1,
        songListId: 1,
        playlistJoin: 1,
        relatedArtists: 1,
      },
    },
  ]);

  if (data.length > 0) {
    return {
      EM: "Lấy artist thành công!",
      EC: "0",
      DT: data[0],
    };
  } else {
    return {
      EM: "Artist not found",
      EC: "1",
      DT: null,
    };
  }
};

const ArtistSong = async (id) => {
  const data = await Ar.aggregate([
    { $match: { alias: id } },
    {
      $lookup: {
        from: "songs",
        localField: "songListId",
        foreignField: "id",
        pipeline: [
          { $project: { songname: 1, thumbnail: 1, id: 1, duration: 1 } },
        ],
        as: "songListId",
      },
    },
    {
      $project: {
        songListId: 1,
      },
    },
  ]);

  if (data.length > 0) {
    return {
      EM: "Lấy artist song thành công!",
      EC: "0",
      DT: data[0].songListId,
    };
  } else {
    return {
      EM: "Artist not found",
      EC: "1",
      DT: null,
    };
  }
};

const Artistplaylist = async (id) => {
  const data = await Ar.aggregate([
    { $match: { alias: id } },
    {
      $lookup: {
        from: "playlists",
        localField: "playListId",
        foreignField: "playlistId",
        as: "playListId",
      },
    },
    {
      $project: {
        playListId: 1,
      },
    },
  ]);

  if (data.length > 0) {
    return {
      EM: "Lấy artist playlist thành công!",
      EC: "0",
      DT: data[0].playListId,
    };
  } else {
    return {
      EM: "Artist not found",
      EC: "1",
      DT: null,
    };
  }
};

module.exports = { infoArtist, ArtistSong, Artistplaylist };
