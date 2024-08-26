import Genres from "../models/genre_model";
import Playlist from "../models/playlist_model";
const getTop100 = async (id) => {
  try {
    const getPlaylistHot = async () => {
      const songHot = await Playlist.find({
        playlistname: { $regex: "Top 100", $options: "i" },
        state: { $ne: 1 },
        type: "playlist",
      })
        .sort({ listen: -1 })
        .limit(5);
      return songHot;
    };
    const getV = async () => {
      const songHot = await Playlist.find({
        playlistname: { $regex: "Top 100", $options: "i" },
        state: { $ne: 1 },
        genresid: { $in: ["IWZ9Z087"] },
      })
        .sort({ listen: -1 })
      return songHot;
    };
    const getChauA = async () => {
      const songHot = await Playlist.find({
        playlistname: { $regex: "Top 100", $options: "i" },
        state: { $ne: 1 },
        genresid: { $in: ["IWZ9Z08U", "IWZ9Z08Z"] },
      })
        .sort({ listen: -1 })
      return songHot;
    };
    const getUS = async () => {
      const songHot = await Playlist.find({
        playlistname: { $regex: "Top 100", $options: "i" },
        state: { $ne: 1 },
        genresid: { $in: ["IWZ9Z086"] },
      })
        .sort({ listen: -1 })
      return songHot;
    };

    const playlistHot = await getPlaylistHot();
    const topV = await getV();
    const topChauA = await getChauA();
    const topUS = await getUS();

  
      return {
        EM: "Không có genres!",
        EC: "0",
        DT: { playlistHot, topV, topChauA, topUS },
      };
    
  } catch (error) {
    // Xử lý lỗi ở đây
    console.error(error);
    return {
      EM: "Đã xảy ra lỗi khi lấy genres!",
      EC: "2",
      DT: "",
    };
  }
};
module.exports = {
  getTop100,
};
