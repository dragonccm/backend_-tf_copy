import User from "../../models/user_model.js";
import Song from "../../models/sonng_model.js";
import Playlist from "../../models/playlist_model.js";
import genre from "../../models/genre_model.js";
const Ar = require('../../models/artists_model');

const searchSongs = async (data) => {
  try {
    const songs = await Song.find({
      $or: [
        { songname: { $regex: data, $options: 'i' } },
        { artists: { $regex: data, $options: 'i' } }
      ]
    }, { lyric: 0 }).limit(10);
    return {
      EM: "Lấy danh thể tìm kiếm thành công!",
      EC: "0",
      DT: {
        songs: songs,
      },
    };
  } catch (err) {
    return {
      EM: "Không lấy tìm được!",
      EC: "-1",
      DT: "",
    };
  }
};

const searchGenre = async (data) => {
  try {
    const Genre = await genre.find({
      $or: [
        { genrename: { $regex: data, $options: 'i' } },
      ]
    }).limit(10);
    return {
      EM: "Lấy danh thể tìm kiếm thành công!",
      EC: "0",
      DT: {
        genre: Genre,
      },
    };
  } catch (err) {
    return {
      EM: "Không lấy tìm được!",
      EC: "-1",
      DT: "",
    };
  }
};

const searchPlaylist = async (data) => {
  try {
    const playlist = await Playlist.find({
      $or: [
        { description: { $regex: data, $options: 'i' } },
        { playlistname: { $regex: data, $options: 'i' } }
      ]
    }).limit(10);
    return {
      EM: "Lấy danh thể tìm kiếm thành công!",
      EC: "0",
      DT: {
        Playlist: playlist,
      },
    };
  } catch (err) {
    return {
      EM: "Không lấy tìm được!",
      EC: "-1",
      DT: "",
    };
  }
};

const searchUser = async (data) => {
  try {
    const user = await User.find({
      $or: [
        { email: { $regex: data, $options: 'i' } },
        { username: { $regex: data, $options: 'i' } }
      ]
    }).limit(10);
    return {
      EM: "Lấy danh thể tìm kiếm thành công!",
      EC: "0",
      DT: {
        User: user,
      },
    };
  } catch (err) {
    return {
      EM: "Không lấy tìm được!",
      EC: "-1",
      DT: "",
    };
  }
};

const searchArtists = async (data) => {
  try {
    const ar = await Ar.find({
      $or: [
        { artistsName: { $regex: data, $options: 'i' } },
        { alias: { $regex: data, $options: 'i' } },
        { realName: { $regex: data, $options: 'i' } }
      ]
    }).limit(10);
    return {
      EM: "Lấy danh thể tìm kiếm thành công!",
      EC: "0",
      DT: {
        ar: ar,
      },
    };
  } catch (err) {
    return {
      EM: "Không lấy tìm được!",
      EC: "-1",
      DT: "",
    };
  }
};


module.exports = {
  searchSongs,
  searchGenre,
  searchPlaylist,
  searchUser,
  searchArtists,
};