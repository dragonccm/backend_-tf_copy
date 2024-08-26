import Song from "../models/sonng_model";
import Playlist from "../models/playlist_model";
import Genres from "../models/genre_model";
const getSong = async (id) => {
  const song = await Song.findOne({
    id: id,
    state: { $ne: 1 }
  });
  if (song) {
    const genreId = song.genresid;
    const genres = [];
    const promises = genreId.map((id) => {
      return Genres.findOne({ genreId: id })
        .then((genresItem) => {
          if (genres) {
            const genresInfo = genresItem;
            genres.push(genresInfo);
          }
        })
        .catch((error) => {
          console.log("Error retrieving playlist:", error);
        });
    });
    try {
      const results = await Promise.all(promises);
      if (results.some((result) => result instanceof Error)) {
        console.log("Error retrieving playlist info:", results);
        return {
          EM: "thêm vào lịch sử thất bại!",
          EC: "1",
          DT: "",
        };
      } else {
        return {
          EM: "thêm vào lịch sử thành công!",
          EC: "0",
          DT: { song, genres },
        };
      }
    } catch (error) {
      console.log("Error retrieving playlist info:", error);
      return {
        EM: "thêm vào lịch sử thất bại!",
        EC: "1",
        DT: "",
      };
    }
  } else {
    return {
      EM: "thêm vào lịch sử thất bại!",
      EC: "1",
      DT: "",
    };
  }
};
const getSongRelated = async (id) => {
  const song = await Song.findOne({
    id: id,
    state: { $ne: 1 }
  });
  if (song) {
    const genreId = song.genresid;
    const genres = [];
    const promises = genreId.map((id) => {
      return Genres.findOne({ genreId: id })
        .then((genresItem) => {
          // Nếu tìm thấy playlist, thêm thông tin vào mảng playlistInfoArray
          if (genres) {
            const genresInfo = genresItem;
            genres.push(genresInfo);
          }
        })
        .catch((error) => {
          console.log("Error retrieving playlist:", error);
        });
    });
    try {
      const results = await Promise.all(promises);
      if (results.some((result) => result instanceof Error)) {
        console.log("Error retrieving playlist info:", results);
        return {
          EM: "thêm vào lịch sử thất bại!",
          EC: "1",
          DT: "",
        };
      } else {
        const songRelated = await Song.find({
          genresid: { $in: song.genresid },
          state: { $ne: 1 }
        })
          .sort({ createdAt: -1 })
          .limit(12);
        const playlistRelated = await Playlist.find({
          genresid: { $in: song.genresid },
        })
          .sort({ createdAt: -1 })
          .limit(5);
        return {
          EM: "thêm vào lịch sử thành công!",
          EC: "0",
          DT: { song, songRelated, playlistRelated },
        };
      }
    } catch (error) {
      console.log("Error retrieving playlist info:", error);
      return {
        EM: "thêm vào lịch sử thất bại!",
        EC: "1",
        DT: "",
      };
    }
  } else {
    return {
      EM: "thêm vào lịch sử thất bại!",
      EC: "1",
      DT: "",
    };
  }
};

module.exports = { getSong, getSongRelated };
