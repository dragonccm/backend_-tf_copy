import Playlist from "../../models/playlist_model";
import Song from "../../models/sonng_model";
import Genres from "../../models/genre_model";
import Ar from "../../models/artists_model";

const getBan = async () => {
  const playlistBan = await Playlist.find({ state: 1 });
  const songBan = await Song.find({ state: 1 });
  const genresBan = await Genres.find({ state: 1 });
  const artistBan = await Ar.find({ state: 1 });
  if (playlistBan && songBan && genresBan) {
    return {
      EM: "lấy dữ liệu thành công!",
      EC: "0",
      DT: { playlist: playlistBan, song: songBan, genres: genresBan, artist: artistBan},
    };
  } else {
    return {
      EM: "lấy dữ liệu thất bại!",
      EC: "-1",
      DT: "",
    };
  }
} 

module.exports = { getBan };