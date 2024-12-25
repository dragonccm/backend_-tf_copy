import Playlist from "../models/playlist_model";
import Song from "../models/sonng_model";
const Ar = require("../models/artists_model");

const getPlaylist = async (id) => {
  const playlist = await Playlist.aggregate([
    {
      $match: {
        playlistId: id,
        state: { $ne: 1 },
      },
    },
    {
      $lookup: {
        from: "songs", // Thay thế bằng tên collection bài hát
        localField: "songid", // Trường songid trong playlist
        foreignField: "id", // Trường _id trong collection bài hát
        as: "songs", // Tên trường chứa kết quả
        let: { songId: "$songid" },
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
      $addFields: {
        songs: { $ifNull: ["$songs", []] },
      },
    },
    {
      $group: {
        _id: "$_id", // Nhóm theo playlistId
        playlistId: { $first: "$playlistId" },
        playlistname: { $first: "$playlistname" },
        thumbnail: { $first: "$thumbnail" },
        type: { $first: "$type" },
        description: { $first: "$description" },
        like: { $first: "$like" },
        songid: { $first: "$songid" },
        listen: { $first: "$listen" },
        songs: { $push: "$songs" }, // Lưu thông tin bài hát vào mảng songs
      },
    },
  ]);
  // console.log(playlist);

  // Kết quả: result là mảng chứa thông tin playlist và bài hát
  if (!playlist) {
    return {
      EM: "thêm vào lịch sử thất bại!",
      EC: "1",
      DT: "",
    };
  }
  if (
    playlist.length > 0 &&
    playlist[0] &&
    playlist[0].songid &&
    playlist[0].songid.length > 0
  ) {
    

    const songId = playlist[0].songid;

    // Use Promise.all to fetch genres and songs concurrently

    // Sort songs based on their index in songId
    playlist[0].songs[0].sort(
      (a, b) => songId.indexOf(a.id) - songId.indexOf(b.id)
    );

    // Check if there are any errors during fetching
    if (playlist[0].songs[0].some((result) => result instanceof Error)) {
      return {
        EM: "thêm vào lịch sử thất bại!",
        EC: "-1",
        DT: "",
      };
    } else {
      try {
        //

        // Lấy danh sách các nghệ sĩ liên quan
        const relatedArtistsIds = playlist[0].songs[0].flatMap(
          (songs) =>
            songs.artists &&
            songs.artists.map((artist) => (artist.id ? artist.id : artist))
        );
        // Loại bỏ các phần tử trùng lặp
        const uniqueArtistsIds = new Set(relatedArtistsIds);

        // Chuyển đổi lại thành mảng
        const uniqueArtistsIdsArray = Array.from(uniqueArtistsIds);

        // Lấy 5 phần tử đầu tiên
        const top5ArtistsIds = uniqueArtistsIdsArray.slice(0, 5);
        const relatedArtists = await Ar.find({
          id: { $in: top5ArtistsIds },
        })
          .select("artistsName id avt totalFollow alias")
          .lean();
        return {
          EM: "thêm vào lịch sử thành công!",
          EC: "0",
          DT: {
            playlist: playlist[0],
            song: playlist[0].songs[0],
            artist: relatedArtists,
          },
        };
      } catch (error) {
        console.log(error);
      }
    }
  } else {

    return {
      EM: "thêm vào lịch sử thành công!",
      EC: "0",
      DT: { playlist: playlist[0], song: [], artist: [] },
    };
  }
};

// lấy danh sách các bài nhạc liên quan với bài hát đang phát
const RelatedPlaylist = async (id) => {
  const currentSong = await Song.findOne(
    { id: id, state: { $ne: 1 } },
    { id: 1, artist: 1, songname: 1, artists: 1, thumbnail: 1, genresid: 1 }
  );
  const genre = currentSong.genresid;
  const randomSongs = await Song.aggregate([
    { $match: { genresid: { $in: genre } } },
    { $sample: { size: 10 } },
    { $sort: { createdAt: -1 } },
  ]);

  const isIDExist = randomSongs.some((song) => song.id == id);

  if (isIDExist) {
    console.log("ID đã tồn tại trong kết quả trả về.");
  } else {
    randomSongs.unshift(currentSong);
    console.log("ID không tồn tại trong kết quả trả về.");
  }
  if (randomSongs) {
    return {
      EM: "thêm vào lịch sử thành công!",
      EC: "0",
      DT: { song: randomSongs },
    };
  } else {
    return {
      EM: "thêm vào lịch sử thất bại!",
      EC: "-1",
      DT: "",
    };
  }
};

module.exports = { getPlaylist, RelatedPlaylist };
