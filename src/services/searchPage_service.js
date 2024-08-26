import Playlist from "../models/playlist_model";
import Song from "../models/sonng_model";
import Ar from "../models/artists_model";

const SearchPage_service = async (keyword) => {
  try {
    const artistResults = await Ar.find({ alias: { $regex: keyword, $options: "i" } }, { artistsName: 1, avt: 1, id: 1,alias:1 });
    const playlistResults = await Playlist.find({ playlistname: { $regex: keyword, $options: "i" } }, { thumbnail: 1, playlistId: 1, playlistname: 1, artistsId: 1 });
    const songResults = await Song.find({ songname: { $regex: keyword, $options: "i" } }, { thumbnail: 1, songname: 1, id: 1, artists: 1, duration: 1});
    const results = [...artistResults.map(artist => ({ ...artist._doc, type: 4 })), ...playlistResults.map(playlist => ({ ...playlist._doc, type: 3 })), ...songResults.map(song => ({ ...song._doc, type: 1 }))];
    if (results) {
      return {
        EM: "lấy dữ liệu thành công!",
        EC: "0",
        DT: results,
      };
    } else {
      return {
        EM: "lấy dữ liệu thất bại!",
        EC: "-1",
        DT: "",
      };
    }
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
}

module.exports = { SearchPage_service };