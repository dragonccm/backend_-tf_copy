import History from "../models/history.js";
import Song from "../models/sonng_model.js";
import Playlist from "../models/playlist_model.js";
import addRanking from "./rankCliend.js"

const addHistory = async (idUser, data) => {
  let roles;
  if (data.type == "song") {
    await Song.findOneAndUpdate(
      { id: data.id },
      { $inc: { listen: 1 } },
      { upsert: true }
    );
    addRanking(data.id)
   

    //   db.SongRanking.insertOne({
    //     rankingDate: new Date(),
    //     songId: data.id,
    //     listenCount: 1,
    //     likeCount: 10,
    //     rank: 1
    // });
    roles = await History.findOneAndUpdate(
      { userId: idUser },
      { $addToSet: { SongHistory: data.id } },
      { upsert: true }
    );
  } else {
    roles = await History.findOneAndUpdate(
      { userId: idUser },
      { $addToSet: { PlaylistHistory: data.id } },
      { upsert: true }
    );
  }

  if (roles) {
    return {
      EM: "thêm vào lịch sử thành công!",
      EC: "0",
      DT: "",
    };
  } else {
    return {
      EM: "thêm vào lịch sử thất bại!",
      EC: "1",
      DT: "",
    };
  }
};

const getMyHistory = async (idUser) => {
  let user = await History.findOne({ userId: idUser });
  if (user) {
    console.log(user);
    const playlistIds = user.PlaylistHistory;
    const songId = user.SongHistory;
    const playlistInfoArray = new Array(playlistIds.length);
    const songInfoArray = new Array(songId.length);

    // Lặp qua từng id playlist và tìm playlist dựa trên id
    const playlistPromises = playlistIds.map((playlistId, index) => {
      return Playlist.findOne({ playlistId: playlistId })
        .then((playlist) => {
          if (playlist) {
            playlistInfoArray[index] = playlist;
          }
        })
        .catch((error) => {
          console.log("Error retrieving playlist:", error);
        });
    });

    // Lặp qua từng id song và tìm song dựa trên id
    const songPromises = songId.map((id, index) => {
      return Song.findOne({ id: id, state: { $ne: 1 } })
        .then((songItem) => {
          if (songItem) {
            songInfoArray[index] = songItem;
          }
        })
        .catch((error) => {
          console.log("Error retrieving song:", error);
        });
    });

    // Đợi cho tất cả các yêu cầu tìm kiếm playlist và song hoàn thành trước khi xử lý kết quả
    try {
      await Promise.all([...playlistPromises, ...songPromises]);
      
      // Loại bỏ những giá trị null hoặc undefined trong mảng
      const validPlaylists = playlistInfoArray.filter((playlist) => playlist);
      const validSongs = songInfoArray.filter((song) => song);

      return {
        EM: "thêm vào lịch sử thành công!",
        EC: "0",
        DT: { playlist: validPlaylists, song: validSongs.reverse() },
      };
    } catch (error) {
      console.log("Error retrieving playlist or song info:", error);
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

module.exports = {
  addHistory,
  getMyHistory,
};
