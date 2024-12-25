const Playlist = require('../../models/playlist_model');
const Ar = require('../../models/artists_model');
const Genre = require('../../models/genre_model');
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
  let responseSent = false;
  try {
    upload(req, res, async function (err) {
      if (responseSent) return;
      if (req.body.status === "create") {
        let form;
        if (err) {
          console.log(err);
          responseSent = true;
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        } else if (!req.file) {
          responseSent = true;
          return res.status(200).json({
            EM: "ảnh không được để trống",
            EC: "-1",
            DT: ""
          });
        } else if (!req.body.playlistname || !req.body.genresid || !req.body.artistsId || !req.body.type || !req.body.description || !req.body.songid || req.body.playlistname.trim() === "" || req.body.genresid.trim() === "" || req.body.artistsId.trim() === "" || req.body.type.trim() === "" || req.body.description.trim() === "" || req.body.songid.trim() === "") {
          responseSent = true;
          return res.status(200).json({
            EM: "không được để trống",
            EC: "-1",
            DT: ""
          });
        }
        else {
          const playlistname = req.body.playlistname;
          const genresid = req.body.genresid;
          const artistsId = req.body.artistsId;
          const type = req.body.type;
          const description = req.body.description;
          const songid = req.body.songid;

          const file = req.file;
          const fileBase64 = file.buffer.toString("base64");

          let fileUrl;
          try {
            const fileResult = await cloudinary.uploader.upload(
              "data:image/png;base64," + fileBase64
            );
            fileUrl = fileResult.secure_url;
            console.log("lonk1", fileUrl);
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
          const newIDAr = uuidv4().substring(0, 8).toUpperCase();

          const newGenreId = genresid.split(",");
          const genrePromises = newGenreId.map(async (id) => {
            const genre = await Genre.findOne({ genreId: id });
            if (!genre) {
              if (!responseSent) {
                responseSent = true;
                return res.status(200).json({
                  EM: "genreId không tồn tại",
                  EC: "-1",
                  DT: ""
                });
              }
            } else {
              await Genre.updateOne({ genreId: id }, { $push: { playlistId: newIDAr } });
            }
          });
          await Promise.all(genrePromises);

          const newArtistId = artistsId.split(",");
          const artistPromises = newArtistId.map(async (id) => {
            const artist = await Ar.findOne({ id: id });
            if (!artist) {
              if (!responseSent) {
                responseSent = true;
                return res.status(200).json({
                  EM: "artistId không tồn tại",
                  EC: "-1",
                  DT: ""
                });
              }
            } else {
              await Ar.updateOne({ id: id }, { $push: { playListId: newIDAr } });
            }
          });
          await Promise.all(artistPromises);
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
        let data = await Playlist.create(form);

        if (data) {
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "thêm mới Playlist thành công",
              EC: "0",
              DT: data
            });
          }
        } else {
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "error from server",
              EC: "-1",
              DT: ""
            });
          }
        }
      }

      else if (req.body.status === "update") {
        let form;
        if (err) {
          console.log(err);
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "error from server",
              EC: "-1",
              DT: ""
            });
          }
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
          const playlistname = req.body.playlistname;
          const genresid = req.body.genresid;
          const artistsId = req.body.artistsId;
          const type = req.body.type;
          const description = req.body.description;
          const songid = req.body.songid;

          const file = req.file;
          const fileBase64 = file.buffer.toString("base64");

          let fileUrl;

          try {
            const fileResult = await cloudinary.uploader.upload(
              "data:image/png;base64," + fileBase64
            );
            fileUrl = fileResult.secure_url;
            console.log("lonk1", fileUrl);
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
          const newGenreId = genresid.split(",");
          const genrePromises = newGenreId.map(async (id) => {
            const genre = await Genre.findOne({ genreId: id });
            if (!genre) {
              if (!responseSent) {
                responseSent = true;
                return res.status(200).json({
                  EM: "genreId không tồn tại",
                  EC: "-1",
                  DT: ""
                });
              }
            } else {
              await Genre.updateOne({ genreId: id }, { $push: { playlistId: playlistId } });
            }
          });
          await Promise.all(genrePromises);

          const newArtistId = artistsId.split(",");
          const artistPromises = newArtistId.map(async (id) => {
            const artist = await Ar.findOne({ id: id });
            if (!artist) {
              if (!responseSent) {
                responseSent = true;
                return res.status(200).json({
                  EM: "artistId không tồn tại",
                  EC: "-1",
                  DT: ""
                });
              }
            } else {
              await Ar.updateOne({ id: id }, { $push: { playListId: playlistId } });
            }
          });
          await Promise.all(artistPromises);
          form = {
            playlistId: playlistId,
            thumbnail: fileUrl,
            playlistname: playlistname,
            genresid: genresid.split(","),
            artistsId: artistsId.split(","),
            type: type,
            description: description,
            songid: songid.split(","),
          };

        }

        console.log("coas up", req.body.playlistId, form);
        let data = await Playlist.updateOne({ playlistId: form.playlistId }, form);

        if (data) {
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "cập nhât thông tin thành công",
              EC: "0",
              DT: data
            });
          }
        } else {
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "error from server",
              EC: "-1",
              DT: ""
            });
          }
        }
      }

      else if (req.body.status === "delete") {
        let data;
        if (req.body.playlistId) {
          const playlist = await Playlist.findOne({ playlistId: req.body.playlistId, state: { $in: [0, 1] } });
          if (playlist) {
            const newState = playlist.state === 1 ? 0 : 1;
            data = await Playlist.updateOne({ playlistId: req.body.playlistId }, { state: newState });
          }
        }
        if (data) {
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "cập nhật thông tin thành công",
              EC: "0",
              DT: data
            });
          }
        } else {
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              EM: "error from server",
              EC: "-1",
              DT: ""
            });
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    if (!responseSent) {
      res.status(200).json({
        EM: "error from server",
        EC: "-1",
        DT: ""
      });
    }
  }
};

module.exports = {
  adminP
};