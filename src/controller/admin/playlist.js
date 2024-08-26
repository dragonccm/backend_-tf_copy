const Playlist = require('../../models/playlist_model');
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

const adminP = async (req, res) => {
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
        } else if (!req.file) {
          return res.status(200).json({
            EM: "ảnh không được để trống",
            EC: "-1",
            DT: ""
          });
        } else if (!req.body.playlistname || !req.body.genresid || !req.body.artistsId || !req.body.type || !req.body.description || !req.body.songid || !req.body.playlistname.trim() === "" || !req.body.genresid.trim() === "" || !req.body.artistsId.trim() === "" || !req.body.type.trim() === "" || !req.body.description.trim() === "" || !req.body.songid.trim() === ""){
          return res.status(200).json({
            EM: "không được để trống",
            EC: "-1",
            DT: ""
          });
        } 
        else {
          const playlistname = req.body.playlistname
          const genresid = req.body.genresid
          const artistsId = req.body.artistsId
          const type = req.body.type
          const description = req.body.description
          const songid = req.body.songid

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
          form = {
            playlistId: newIDAr,
            playlistname: playlistname,
            genresid: genresid.split(","),
            artistsId: artistsId.split(","),
            thumbnail: fileUrl,
            type: type,
            description: description,
            songid: songid.split(","),
          };
        }

        console.log(data);
        let data = await Playlist.create(form);

        if (data) {
          return res.status(200).json({
            EM: "thêm mới Playlist thành công",
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
            playlistId: req.body.playlistId,
            playlistname: req.body.playlistname,
            genresid: req.body.genresid.split(","),
            artistsId: req.body.artistsId.split(","),
            type: req.body.type,
            description: req.body.description,
            songid: req.body.songid.split(","),
          };
        } else {
          const playlistId = req.body.playlistId;
          const playlistname = req.body.playlistname
          const genresid = req.body.genresid
          const artistsId = req.body.artistsId
          const type = req.body.type
          const description = req.body.description
          const songid = req.body.songid

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
            playlistId: playlistId,
            thumbnail: fileUrl,
            playlistname: playlistname,
            genresid: genresid.split(","),
            artistsId: artistsId.split(","),
            type: type,
            description: description,
            songid: songid.split(","),
          }

        }

        console.log("coas up", req.body.playlistId, form);
        let data = await Playlist.updateOne({ playlistId: form.playlistId }, form);

        if (data) {
          return res.status(200).json({
            EM: "cập nhât thông tin thành công",
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
        let data;
        if (req.body.playlistId) {
          // Cập nhật trạng thái đảo ngược cho Playlist
          const playlist = await Playlist.findOne({ playlistId: req.body.playlistId, state: { $in: [0, 1] } });
          if (playlist) {
            const newState = playlist.state === 1 ? 0 : 1;
            data = await Playlist.updateOne({ playlistId: req.body.playlistId }, { state: newState });
          }
        }
        if (data) {
          return res.status(200).json({
            EM: "cập nhật thông tin thành công",
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
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: ""
    });
  }
}

module.exports = {
  adminP
};