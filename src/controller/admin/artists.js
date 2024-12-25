const Ar = require('../../models/artists_model');
const Song = require('../../models/sonng_model');
const playlist = require('../../models/playlist_model');
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "drupmc7qd",
  api_key: "725439635389318",
  api_secret: "c52-kr9-K0JKIQVNLQNZnSD5FRs",
});
const multer = require("multer");


const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");


const adminA = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      // upate !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (req.body.status === "create") {
        let form;
        if (err) {
          console.log(err);
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        } else {
          const artistsName = req.body.artistsName
          const biography = req.body.biography
          const birthday = req.body.birthday
          const realName = req.body.realName
          const songListId = req.body.songListId
          const playListId = req.body.playListId
          const file = req.file;
          const fileBase64 = file.buffer.toString("base64");

          let fileUrl;

          try {
            const fileResult = await cloudinary.uploader.upload(
              "data:image/png;base64," + fileBase64
            );
            fileUrl = fileResult.secure_url;
            console.log("lonk1", fileUrl)
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
          const newIDAr = uuidv4().substring(0, 8).toUpperCase();
          const newSongListId = songListId.split(",");
          const newPlayListId = playListId.split(",");

          const songPromises = newSongListId.map(async (id) => {
            const song = await Song.findOne({ id: id });
            if (!song) {
              return res.status(200).json({
                EM: "songId không tồn tại",
                EC: "-1",
                DT: ""
              });
            } else {
              await song.updateOne({ $push: { artistsId: id } });
            }
          });

          const playlistPromises = newPlayListId.map(async (id) => {
            const play = await playlist.findOne({ playlistId: id });
            if (!play) {
              return res.status(200).json({
                EM: "playlistId không tồn tại",
                EC: "-1",
                DT: ""
              });
            } else {
              await play.updateOne({ $push: { playlistId: id } });
            }
          });

          await Promise.all([...songPromises, ...playlistPromises]);

          form = {
            infor: {
              id: newIDAr,
              artistsName: artistsName,
              avt: fileUrl,
              alias: artistsName,
              biography: biography,
              birthday: birthday,
              realName: realName,
              songListId: songListId.split(","),
              playListId: playListId.split(","),
              totalFollow: 0
            }
          };
        }

        let data = await Ar.create(form.infor);
        console.log(data);

        if (data) {
          return res.status(200).json({
            EM: "thêm mới nghệ sĩ thành công",
            EC: "0",
            DT: data.DT
          });
        } else {
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        }
      }

      // create +++++++++++++++++++++++++++++++++++++++++++++++++++++++
      else if (req.body.status === "update") {
        let form;
        if (err) {
          console.log(err);
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        } else if (!req.file) {
          form = {
              artistsName: req.body.artistsName,
              biography: req.body.biography,
              birthday: req.body.birthday,
              realName: req.body.realName,
              songListId: req.body.songListId.split(","),
              playListId: req.body.playListId.split(",")
          };
        } else {
          const artistsName = req.body.artistsName
          const biography = req.body.biography
          const birthday = req.body.birthday
          const realName = req.body.realName
          const songListId = req.body.songListId
          const playListId = req.body.playListId

          const file = req.file;
          const fileBase64 = file.buffer.toString("base64");

          let fileUrl;

          try {
            const fileResult = await cloudinary.uploader.upload(
              "data:image/png;base64," + fileBase64
            );
            fileUrl = fileResult.secure_url;
            console.log("lonk1", fileUrl)
          } catch (error) {
            console.log("Failed to upload file:", error);
          }

          form = {
            artistsName: artistsName,
            avt: fileUrl,
            alias: artistsName,
            biography: biography,
            birthday: birthday,
            realName: realName,
            songListId: songListId.split(","),
            playListId: playListId.split(","),
            totalFollow: 0
          }

        }

        const songListId = req.body.songListId.split(",");
        songListId.forEach((id) => {
          const song = Song.findOne({ id: id });
          if (!song) {
            return res.status(200).json({
              EM: "songId không tồn tại",
              EC: "-1",
              DT: ""
            });
          } else {
            song.updateOne({ $push: { artistsId: id } });
          }
        });
        const playListId = req.body.playListId.split(",");
        playListId.forEach((id) => {
          const play = playlist.findOne({ playlistId: id });
          if (!play) {
            return res.status(200).json({
              EM: "playlistId không tồn tại",
              EC: "-1",
              DT: ""
            });
          } else {
            play.updateOne({ $push: { playlistId: id } });
          }
        });

        let data = await Ar.findOneAndUpdate({ id: req.body.id }, form);
console.log(form)
        if (data) {
          return res.status(200).json({
            EM: "cập nhật thông tin thành công",
            EC: "0",
            DT: data.DT
          });
        } else {
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        }
      }

      else if (req.body.status === "delete") {
        console.log(req.body)
        let data
        if (req.body.id) {
          const curr = await Ar.findOne({ id: req.body.id }, { state: 1, _id: 0 })
          data = await Ar.updateOne({ id: req.body.id }, { state: curr.state === 1 ? 0 : 1 })
        }
        if (data) {
          return res.status(200).json({
            EM: "success",
            EC: "0",
            DT: data
          });
        } else {
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        }
      }
    });
  } catch (err) {
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: ""
    });
  }
};

module.exports = {
  adminA
};