import User from "../models/user_model.js";
import Song from "../models/sonng_model.js";
import Playlist from "../models/playlist_model.js";
import genre from "../models/genre_model.js";
const Ar = require("../models/artists_model");
import { checkPassword, hashPassword } from "./Authentication_service.js";
const { v4: uuidv4 } = require("uuid");
const { Nuxtify } = require("nuxtify-api");
const SongRanking = require("../models/songRanking_model.js");
const PlaylistRanking = require("../models/playlistRanking_model.js");
import {getIO}  from "../socket/socketConfig.js";

const getInfor = async (id) => {
  let user = await User.findOne({ id: id });
  if (user) {
    return {
      EM: "ok!",
      EC: "0",
      DT: user,
    };
  } else {
    return false;
  }
};
const updateInfor = async (data, id) => {
  const newInfor = data.infor;
  console.log(newInfor);
  const user = await User.findOne({ id: id });
  const checkUsername = await User.findOne({ username: newInfor.username });
  if (checkUsername && user.username != newInfor.username) {
    return {
      EM: "Username is already",
      EC: "1",
      DT: [],
    };
    
    // Nếu đã có tài khoản sử dụng địa chỉ email này, xử lý logic trả về thông báo hoặc hành động phù hợp.
  } else {
    const checkEmail = await User.findOne({ email: newInfor.email });
    if (checkEmail  && user.email != newInfor.email) {
      return {
        EM: "Email is already",
        EC: "1",
        DT: [],
      };
    }else if (user.type=='email'  && user.email != newInfor.email) {
      return {
        EM: "Không được đổi email này!!",
        EC: "1",
        DT: [],
      };
    } else {
        const updateUser = await User.findOneAndUpdate({ id: id }, newInfor, {
          upsert: true,
          new: true,
        }).select("-_id username email birthday avt");
        if (updateUser) {
          return {
            EM: "updated successfully",
            EC: "0",
            DT: updateUser,
          };
        } else {
          console.log(
            "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
          );
          return false;
        }
      
    }
  }
};
const changepassword = async (data, id) => {
  const newInfor = data;
  let updateUser;
  const user = await User.findOne({
    id: id,
  });
  if (user && user.password) {
    let isCorrectPassword = await checkPassword(
      newInfor.password,
      user.password
    );
    if (isCorrectPassword) {
      let hashPass = hashPassword(newInfor.newPassword);
      updateUser = await User.findOneAndUpdate(
        { id: id },
        { password: hashPass },
        { upsert: true }
      );
    } else {
      return {
        EM: "Bạn đã sai mật khẩu!",
        EC: "1",
        DT: "",
      };
    }
  }
  if (updateUser) {
    return {
      EM: "ok!",
      EC: "0",
      DT: "",
    };
  } else {
    return {
      EM: "error from server",
      EC: "-1",
      DT: "",
    };
  }
};
const resetpassword = async (data, id) => {
  const newInfor = data;
  let updateUser;
  const user = await User.findOne({
    id: id,
  });
  if (user) {
    let checkNewPass = await checkPassword(newInfor.newPassword, user.password);
    if (!checkNewPass) {

      let hashPass = hashPassword(newInfor.newPassword);
      updateUser = await User.findOneAndUpdate(
        { id: id },
        { password: hashPass },
        { upsert: true }
      );
    } else {
      return {
        EM: "Mật khẩu mới trùng với các mật khẩu trước!",
        EC: "3",
        DT: "",
      };
    }
  } else {
    return {
      EM: "Không tồn tại tài khoản này!",
      EC: "1",
      DT: "",
    };
  }
  if (updateUser) {
    return {
      EM: "ok!",
      EC: "0",
      DT: "",
    };
  } else {
    return {
      EM: "error from server",
      EC: "-1",
      DT: "",
    };
  }
};
const addBanSong = async (songId, id) => {
  const updateUser = await User.findOneAndUpdate(
    { id: id },
    { $addToSet: { banSongs: songId } },
    { upsert: true }
  );
  if (updateUser) {
    const userUpdate = await User.findOne({ id: id });

    return {
      EM: "Bài nhạc đã bị cấm",
      EC: "0",
      DT: userUpdate.banSongs,
    };
  } else {
    return {
      EM: "error from server",
      EC: "-1",
      DT: "",
    };
  }
};
const addLike = async (data, id) => {
  let updateData;
  if (data.type == "song") {
    let ps = await Song.findOne({ id: data.id });
    let songRanking = await SongRanking.findOne({ songId: data.id });
    if (ps) {
      updateData = await User.findOneAndUpdate(
        { id: id },
        { $addToSet: { likedSongs: data.id } },
        { upsert: true }
      );
      if (songRanking) {
        if (songRanking.rankingDate.getDate() === new Date().getDate()) {
          songRanking.likeCount += 1;
          await songRanking.save();
        } else {
          const newRanking = new SongRanking({
            songId: songRanking.songId,
            likeCount: 1,
            rankingDate: new Date(),
          });
          await newRanking.save();
        }
      } else {
        const newRanking = new SongRanking({
          songId: data.id,
          likeCount: 1,
          rankingDate: new Date(),
        });
        await newRanking.save();
      }
    } else {
      return {
        EM: "không thấy bài hát này",
        EC: "-1",
        DT: "",
      };
    }
  } else {
    let ps = await Playlist.findOne({ playlistId: data.id });
    let playlistRanking = await PlaylistRanking.findOne({
      playlistId: data.id,
    });
    if (ps) {
      updateData = await User.findOneAndUpdate(
        { id: id },
        { $addToSet: { likedPlayLists: data.id } },
        { upsert: true }
      );
      if (playlistRanking) {
        if (playlistRanking.rankingDate.getDate() === new Date().getDate()) {
          playlistRanking.likeCount += 1;
          await playlistRanking.save();
        } else {
          const newRanking = new PlaylistRanking({
            playlistId: playlistRanking.playlistId,
            likeCount: 1,
            rankingDate: new Date(),
          });
          await newRanking.save();
        }
      } else {
        const newRanking = new PlaylistRanking({
          playlistId: data.id,
          likeCount: 1,
          rankingDate: new Date(),
        });
        await newRanking.save();
      }
    } else {
      return {
        EM: "không thấy playlist này",
        EC: "-1",
        DT: "",
      };
    }
  }
  if (updateData) {
    return {
      EM: "Đã thêm vào danh sách yêu thích!",
      EC: "0",
      DT: "",
    };
  } else {
    return {
      EM: "error from server",
      EC: "-1",
      DT: "",
    };
  }
};
const unLike = async (data, id) => {
  let updateData;
  if (data.type == "song") {
    let ps = await Song.findOne({ id: data.id });
    let songRanking = await SongRanking.findOne({ songId: data.id });

    if (ps) {
      updateData = await User.findOneAndUpdate(
        { id: id },
        { $pull: { likedSongs: data.id } },
        { new: true }
      );
      if (songRanking) {
        if (songRanking.rankingDate.getDate() === new Date().getDate()) {
          songRanking.likeCount -= 1;
          await songRanking.save();
        } else {
          const newRanking = new SongRanking({
            songId: data.id,
            likeCount: 1,
            rankingDate: new Date(),
          });
          await newRanking.save();
        }
      } else {
        const newRanking = new SongRanking({
          songId: data.id,
          likeCount: 1,
          rankingDate: new Date(),
        });
        await newRanking.save();
      }
    } else {
      return {
        EM: "không thấy bài hát này",
        EC: "-1",
        DT: "",
      };
    }
  } else {
    let ps = await Playlist.findOne({ playlistId: data.id });
    let playlistRanking = await PlaylistRanking.findOne({
      playlistId: data.id,
    });

    if (ps) {
      updateData = await User.findOneAndUpdate(
        { id: id },
        { $pull: { likedPlayLists: data.id } },
        { new: true }
      );
      if (playlistRanking) {
        if (playlistRanking.rankingDate.getDate() === new Date().getDate()) {
          playlistRanking.likeCount -= 1;
          await playlistRanking.save();
        } else {
          const newRanking = new PlaylistRanking({
            playlistId: data.id,
            likeCount: 1,
            rankingDate: new Date(),
          });
          await newRanking.save();
        }
      } else {
        const newRanking = new PlaylistRanking({
          playlistId: data.id,
          likeCount: 1,
          rankingDate: new Date(),
        });
        await newRanking.save();
      }
    } else {
      return {
        EM: "không thấy playlist này",
        EC: "-1",
        DT: "",
      };
    }
  }
  if (updateData) {
    return {
      EM: "Đã thêm vào danh sách yêu thích!",
      EC: "0",
      DT: "",
    };
  } else {
    return {
      EM: "error from server",
      EC: "-1",
      DT: "",
    };
  }
};
const getMyPlaylist = async (idUser) => {
  try {
    const getUser = await User.findOne({ id: idUser });
    if (getUser.myPlayLists.length > 0) {
      const getplaylist = async (id) => {
        return await Playlist.findOne({ playlistId: id }).select('playlistId playlistname thumbnail songid');
      };
      const playlistPromises = getUser.myPlayLists.map((idPlaylist) => {
        return getplaylist(idPlaylist);
      });
      const playlists = await Promise.all(playlistPromises);
      return {
        EM: "Lấy danh sách nhạc đã tạo thành công!",
        EC: "0",
        DT: playlists,
      };
    } else {
      return {
        EM: "Lấy danh sách nhạc đã tạo thành công!",
        EC: "1",
        DT: [],
      };
    }
  } catch (err) {
    return {
      EM: "Lấy danh sách nhạc đã tạo thất bại!",
      EC: "-1",
      DT: "",
    };
  }
};
const createMyPlaylist = async (user, playlistname) => {
  try {
    const getUser = await User.findOne({ id: user.id });
    const getplaylist = async (id) => {
      return await Playlist.findOne({ playlistId: id }, "playlistname");
    };
    const playlistPromises = getUser.myPlayLists.map((idPlaylist) => {
      return getplaylist(idPlaylist);
    });
    const playlists = await Promise.all(playlistPromises);
    const isDuplicateName = async (newPlaylistName) => {
      const hasDuplicate = await playlists.some((playlist) => {
        return playlist && playlist.playlistname === newPlaylistName;
      });
      return hasDuplicate;
    };
    const hasDuplicate = await isDuplicateName(playlistname);
    if (!hasDuplicate) {
      const newPlaylistID = uuidv4().substring(0, 8).toUpperCase();
      //Tạo playlist mới với các thông tin tương ứng
      const createdPlaylist = new Playlist({
        playlistId: newPlaylistID,
        playlistname: playlistname,
        genresid: [],
        artistsId: [user.id],
        description: "/",
        songid: [],
        like: 0,
        listen: 0,
        state: 0,
        type: "user",
      });

      // Lưu playlist
      const data1 = await createdPlaylist.save();

      //Thêm playlistId vào mảng playlistId của user
      // getUser.myPlayLists.push(newPlaylistID);
      // const data2 = await getUser.save();
      const data2 = await User.findOneAndUpdate(
        { id: user.id }, // Điều kiện tìm kiếm người dùng
        { $addToSet: { myPlayLists: newPlaylistID } }, // Thêm newPlaylistID vào mảng myPlayLists (không trùng lặp)
        { new: true } // Tạo mới nếu không tìm thấy và trả về đối tượng người dùng đã được cập nhật
      );

      console.log("Thêm playlist vào myPlaylists:", data2, data1);
      return {
        EM: "Tạo danh sách nhạc thành công!",
        EC: "0",
        DT: { playlistId: data2, message: data1 },
      };
    } else {
      return {
        EM: "Không thể tạo danh sách nhạc!",
        EC: "-1",
        DT: "",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      EM: "Không thể tạo danh sách nhạc!!",
      EC: "-1",
      DT: "",
    };
  }
};
const addToMyPlaylist = async (idUser, data) => {
  try {
    const curUser = await User.findOne({ id: idUser });
    const playlist = await Playlist.findOne({ playlistId: data.playlistId });

    if (
      !curUser ||
      !playlist ||
      !curUser.myPlayLists ||
      curUser.myPlayLists.indexOf(playlist.playlistId) === -1
    ) {
      return {
        EM: "Không thể tạo danh sách nhạc!",
        EC: "-1",
        DT: "",
      };
    } else {
      console.log("hahaha", data.songId);
      // Chuyển đổi các songId trong playlist thành một tập hợp (set)
      const existingSongIds = new Set(playlist.songid);

      // Tạo một mảng mới chứa các songId cần thêm
      const songsToAdd = data.songId.filter((id) => !existingSongIds.has(id));
      console.log("songsToAdd", songsToAdd);
      // Thêm các bài hát mới vào playlist
      await Playlist.updateOne(
        { playlistId: data.playlistId },
        { $push: { songid: { $each: songsToAdd } } }
      );

      return {
        EM: "Thêm vào playlist thành công",
        EC: "0",
        DT: "",
      };
    }
  } catch (err) {
    console.error(err);

    return {
      EM: "Không thể thêm vào danh sách nhạc!",
      EC: "-1",
      DT: "",
    };
  }
};

const getAllUser = async (data) => {
  const limit = data;
  try {
    // Truy vấn dữ liệu user sau khi xóa trùng lặp
    const UserCount = await User.countDocuments({});
    const Userdata = await User.find(
      {},
      {
        _id: 1,
        id: 1,
        username: 1,
        birthday: 1,
        avt: 1,
        email: 1,
        likedPlayLists: 1,
        likedSongs: 1,
        myPlayLists: 1,
        banSongs: 1,
        createdAt: 1,
        role: 1,
      }
    )
      .sort({ _id: -1 })
      .skip(+limit)
      .limit(10);

    const responseData = { handledata: Userdata, maxPage: UserCount };
    return {
      EM: "Lấy danh sách nhạc đã tạo thành công!",
      EC: "0",
      DT: responseData,
    };
  } catch (err) {
    return {
      EM: "Không lấy danh sách user!",
      EC: "-1",
      DT: "",
    };
  }
};
const getGenres = async (data) => {
  const limit = data;
  try {
    // Truy vấn dữ liệu user sau khi xóa trùng lặp
    const genreCount = await genre.countDocuments({});
    const genredata = await genre
      .find(
        {},
        {
          _id: 1,
          genreId: 1,
          genrename: 1,
          thumbnail: 1,
          playListId: 1,
          state: 1,
          listen: 1,
          description: 1,
        }
      )
      .sort({ _id: -1 })
      .skip(+limit)
      .limit(10);

    const responseData = { handledata: genredata, maxPage: genreCount };
    return {
      EM: "Lấy danh thể loại tạo thành công!",
      EC: "0",
      DT: responseData,
    };
  } catch (err) {
    return {
      EM: "Không lấy danh sách thể loại!",
      EC: "-1",
      DT: "",
    };
  }
};
const adminHomeService = async () => {
   try {
    const songs = await Song.countDocuments({});
    const Genre = await genre.countDocuments({});
    const playlist = await Playlist.countDocuments({});
    const user = await User.countDocuments({});
    const ar = await Ar.countDocuments({});
    return {
      EM: "Lấy dữ liệu trang cghur thành công!",
      EC: "0",
      DT: {
        songs: songs,
        genre: Genre,
        Playlist: playlist,
        User: user,
        ar: ar,
      },
    };
  } catch (err) {
    return {
      EM: "Không lấy  dữ liệu trang cghur được!",
      EC: "-1",
      DT: "",
    };
  }
};
const getMylikesSongs = async (idUser) => {
  try {
    const getUser = await User.findOne({ id: idUser });

    if (getUser.likedSongs.length > 0) {
      const getsong = async (id) => {
        const song = await Song.findOne({ id: id }).select('id songname thumbnail duration songLink');
        return song 
      };
      const getplaylist = async (id) => {
        const playlist = await Playlist.findOne({ playlistId: id }).select('playlistId playlistname thumbnail');
        return playlist
      };
      const songPromises = getUser.likedSongs.map((idSong) => {
        return getsong(idSong);
      });
      const songs = await Promise.all(songPromises).then(songs => songs.filter(song => song !== null));

      const playlistPromises = getUser.likedPlayLists.map((idplaylist) => {
        return getplaylist(idplaylist);
      });
      const playlists = await Promise.all(playlistPromises);

      return {
        EM: "Lấy danh sách nhạc đã thich thành công!",
        EC: "0",
        DT: { songs: songs, playlist: playlists },
      };
    } else {
      return {
        EM: "Lấy danh sách nhạc đã thich thành công!",
        EC: "0",
        DT: { songs: [], playlist: [] },
      };
    }
  } catch (err) {
    return {
      EM: "Lấy danh sách nhạc đã thich thất bại!",
      EC: "-1",
      DT: "",
    };
  }
};
const getBlockedSong = async (idUser) => {
  try {
    const getUser = await User.findOne({ id: idUser });

    if (getUser.banSongs.length > 0) {
      const getsong = async (id) => {
        return await Song.findOne({ id: id }).select('id songname thumbnail songLink');
      };
      const songPromises = getUser.banSongs.map((idSong) => {
        return getsong(idSong);
      });
      const songs = await Promise.all(songPromises);
      return {
        EM: "Lấy danh sách nhạc đã thich thành công!",
        EC: "0",
        DT: songs,
      };
    } else {
      return {
        EM: "Lấy danh sách nhạc đã thich thành công!",
        EC: "0",
        DT: [],
      };
    }
  } catch (err) {
    return {
      EM: "Lấy danh sách nhạc đã thich thất bại!",
      EC: "-1",
      DT: "",
    };
  }
};
const removeBlockedSong = async (idUser,id) => {
  try {
    const getUser =await User.findOneAndUpdate(
      { id: idUser },
      { $pull: { banSongs: id } },
      { new: true } 
    );

    if (getUser) {
      const userUpdate = await User.findOne({ id: idUser });
      return {
        EM: "Unban thành công!",
        EC: "0",
        DT: userUpdate.banSongs,
      };
    } else {
      return {
        EM: "Unban thất bại!",
        EC: "1",
        DT: '',
      };
    }
  } catch (err) {
    return {
      EM: "Lấy danh sách nhạc đã thich thất bại!",
      EC: "-1",
      DT: "",
    };
  }
};
const changeRole = async (data) => {
  let updateData;
  if (data.status === "delete") {
    const userID = data.id;
    const user = await User.findOne({ id: userID });
    let checkrole;
    if (user.role === "admin") {
      checkrole = "0";
    } else if (user.role === "user") {
      checkrole = "1";
    } else if (user.role === "ban") {
      checkrole = "2";
    }
    if (checkrole === data.role) {
      return {
        EM: "lỗi đổi quyền",
        EC: "-1",
        DT: "",
      };
    }
    if (data.role === "admin") {
      const result = await User.updateOne(
        { id: userID },
        { role: "0" },
        { upsert: true }
      );
      if (result.modifiedCount > 0) {
        updateData = data.role;
      }
    } else if (data.role === "user") {
      const result = await User.updateOne(
        { id: userID },
        { role: "1" },
        { upsert: true }
      );
      if (result.modifiedCount > 0) {
        updateData = data.role;
      }
    } else if (data.role === "ban") {
      const result = await User.updateOne(
        { id: userID },
        { role: "2" },
        { upsert: true }
      );
      if (result.modifiedCount > 0) {
        updateData = data.role;
        const io = getIO();
        io.emit('ban_user', userID);
      }
    } else {
      return {
        EM: "quyền không hợp lệ",
        EC: "-1",
        DT: "",
      };
    }
    if (updateData) {
      return {
        EM: `đã cập nhật quyền thành công : quyền >> ${updateData}`,
        EC: "0",
        DT: "",
      };
    } else {
      return {
        EM: "lỗi cập nhật quyền",
        EC: "-1",
        DT: "",
      };
    }
  }
};

const deleteMyPlaylist = async (user, id) => {
  try {
    const getUser = await User.findOne({ id: user });
    if (getUser.myPlayLists.indexOf(id) === -1) {
      return {
        EM: "Không tìm thấy playlist này!",
        EC: "-1",
        DT: "",
      };
    } else {
      const result = await Playlist.deleteOne({ playlistId: id });
      if (result.deletedCount > 0) {
        getUser.myPlayLists = getUser.myPlayLists.filter(
          (playlistId) => playlistId !== id
        );
        await getUser.save();
        return {
          EM: "Xóa playlist thành công!",
          EC: "0",
          DT: "",
        };
      } else {
        return {
          EM: "Không thể xóa playlist!",
          EC: "-1",
          DT: "",
        };
      }
    }
  } catch (err) {
    console.error(err);
    return {
      EM: "Không thể tạo danh sách nhạc!!",
      EC: "-1",
      DT: "",
    };
  }
};
module.exports = {
  getInfor,
  updateInfor,
  changepassword,
  addBanSong,
  addLike,
  unLike,
  getMyPlaylist,
  createMyPlaylist,
  addToMyPlaylist,
  getAllUser,
  getGenres,
  adminHomeService,
  getMylikesSongs,
  changeRole,
  deleteMyPlaylist,
  resetpassword,
  getBlockedSong,removeBlockedSong
};
