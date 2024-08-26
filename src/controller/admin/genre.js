const genre = require('../../models/genre_model');
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
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "thumbnailHasText", maxCount: 1 },
  { name: "thumbnailR", maxCount: 1 },
]);
const adminG = async (req, res) => {
  upload(req, res, async function (err) {
    // upate !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (req.body.status === "update") {
      let form;
      if (err) {
        console.log("Failed to upsddddddddddddddddddđload file:233");
        return res.status(200).json({
          EM: "error from server",
          EC: "-1",
          DT: ""
        });
      } else if (!req.files) {
        console.log("Failed to upsddddddddddddddddddđload file:");
        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const description = req.body.description;
        const listen = req.body.listen;
        const state = req.body.state;
        form = {
          genreId: genreId,
          genrename: genrename,
          listen: listen,
          description: description,
          state: state
        };
      } else if (req.files.thumbnail && req.files.thumbnailHasText && req.files.thumbnailR) {

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailFile = req.files.thumbnail[0];
        const thumbnailHasTextFile = req.files.thumbnailHasText[0];
        const thumbnailRFile = req.files.thumbnailR[0];


        const thumbnailBase64 = thumbnailFile.buffer.toString("base64");
        const thumbnailHasTextBase64 = thumbnailHasTextFile.buffer.toString("base64");
        const thumbnailRBase64 = thumbnailRFile.buffer.toString("base64");

        let thumbnailUrl;
        let thumbnailHasTextUrl;
        let thumbnailRUrl;
        // Bổ xung các câu điều kiện kiểm tra tính tồn tại của file và songLink
        if (thumbnailBase64 && thumbnailHasTextBase64 && thumbnailRBase64) {

          try {
            const thumbnailResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailBase64);
            thumbnailRUrl = thumbnailResult.secure_url;
            const thumbnailHasTextResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailHasTextBase64);
            thumbnailHasTextUrl = thumbnailHasTextResult.secure_url;
            const thumbnailRResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailRBase64);
            thumbnailUrl = thumbnailRResult.secure_url;
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnail: thumbnailUrl,
          thumbnailHasText: thumbnailHasTextUrl,
          thumbnailR: thumbnailRUrl,
          state: state,
          description: description,
          playListId: []
        };
      } else if (req.files.thumbnail && req.files.thumbnailHasText && !req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:2");

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailFile = req.files.thumbnail[0];
        const thumbnailHasTextFile = req.files.thumbnailHasText[0];



        const thumbnailBase64 = thumbnailFile.buffer.toString("base64");
        const thumbnailHasTextBase64 = thumbnailHasTextFile.buffer.toString("base64");


        let thumbnailUrl;
        let thumbnailHasTextUrl;

        // Bổ xung các câu điều kiện kiểm tra tính tồn tại của file và songLink
        if (thumbnailBase64 && thumbnailHasTextBase64) {
          try {
            const thumbnailResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailBase64);
            thumbnailUrl = thumbnailResult.secure_url;
            const thumbnailHasTextResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailHasTextBase64);
            thumbnailHasTextUrl = thumbnailHasTextResult.secure_url;

          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnail: thumbnailUrl,
          thumbnailHasText: thumbnailHasTextUrl,
          state: state,
          description: description,
          playListId: []
        };

      } else if (req.files.thumbnail && !req.files.thumbnailHasText && req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:3");

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailFile = req.files.thumbnail[0];
        const thumbnailRFile = req.files.thumbnailR[0];


        const thumbnailBase64 = thumbnailFile.buffer.toString("base64");

        const thumbnailRBase64 = thumbnailRFile.buffer.toString("base64");

        let thumbnailUrl;
        let thumbnailRUrl;
        // Bổ xung các câu điều kiện kiểm tra tính tồn tại của file và songLink
        if (thumbnailBase64 && thumbnailRBase64) {
          try {
            const thumbnailResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailBase64);
            thumbnailRUrl = thumbnailResult.secure_url;

            const thumbnailRResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailRBase64);
            thumbnailUrl = thumbnailRResult.secure_url;
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnail: thumbnailUrl,
          thumbnailR: thumbnailRUrl,
          state: state,
          description: description,
          playListId: []
        };

      } else if (!req.files.thumbnail && req.files.thumbnailHasText && req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:4");

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailHasTextFile = req.files.thumbnailHasText[0];
        const thumbnailRFile = req.files.thumbnailR[0];


        const thumbnailHasTextBase64 = thumbnailHasTextFile.buffer.toString("base64");
        const thumbnailRBase64 = thumbnailRFile.buffer.toString("base64");

        let thumbnailHasTextUrl;
        let thumbnailRUrl;
        // Bổ xung các câu điều kiện kiểm tra tính tồn tại của file và songLink
        if (thumbnailHasTextUrl && thumbnailRUrl) {
          try {
            const thumbnailHasTextResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailHasTextBase64);
            thumbnailHasTextUrl = thumbnailHasTextResult.secure_url;
            const thumbnailRResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailRBase64);
            thumbnailRUrl = thumbnailRResult.secure_url;

          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnail: thumbnailUrl,
          thumbnailHasText: thumbnailHasTextUrl,
          thumbnailR: thumbnailRUrl,
          state: state,
          description: description,
          playListId: []
        };

      } else if (req.files.thumbnail && !req.files.thumbnailHasText && !req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:5");

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailFile = req.files.thumbnail[0];

        const thumbnailBase64 = thumbnailFile.buffer.toString("base64");

        let thumbnailUrl;

        if (thumbnailBase64) {
          try {
            const thumbnailResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailBase64);
            thumbnailUrl = thumbnailResult.secure_url;
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnail: thumbnailUrl,
          state: state,
          description: description,
          playListId: []
        };
      } else if (!req.files.thumbnail && req.files.thumbnailHasText && !req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:6");

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailHasTextFile = req.files.thumbnailHasText[0];

        const thumbnailHasTextBase64 = thumbnailHasTextFile.buffer.toString("base64");

        let thumbnailHasTextUrl;

        if (thumbnailHasTextBase64) {
          try {
            const thumbnailHasTextResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailHasTextBase64);
            thumbnailHasTextUrl = thumbnailHasTextResult.secure_url;
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnailHasText: thumbnailHasTextUrl,
          state: state,
          description: description,
          playListId: []
        };
      } else if (!req.files.thumbnail && !req.files.thumbnailHasText && req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:7");

        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const playListId = req.body.playListId;
        const thumbnailRFile = req.files.thumbnailR[0];

        const thumbnailRBase64 = thumbnailRFile.buffer.toString("base64");

        let thumbnailRUrl;

        if (thumbnailRBase64) {
          try {
            const thumbnailRResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailRBase64);
            thumbnailRUrl = thumbnailRResult.secure_url;
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }

        form = {
          genreId: genreId,
          genrename: genrename,
          thumbnailR: thumbnailRUrl,
          state: state,
          description: description,
          playListId: []
        };
      } else if (!req.files.thumbnail && !req.files.thumbnailHasText && !req.files.thumbnailR) {
        console.log("Failed to upsddddddddddddddddddđload file:");
        const genreId = req.body.genreId;
        const genrename = req.body.genrename;
        const description = req.body.description;
        const listen = req.body.listen;
        const state = req.body.state;
        form = {
          genreId: genreId,
          genrename: genrename,
          listen: listen,
          description: description,
          state: state
        };
      }
      try {
        const data = await genre.updateOne({ genreId: req.body.genreId }, form, {upsert : true});
        if (data) {
          return res.status(200).json({
            EM: "cập nhật thông tin thành công",
            EC: "0",
            DT: form
          });
        } else {
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
          });
        }
      } catch (error) {
        console.log("Failed to update song:", error);
        return res.status(200).json({
          EM: "error from server",
          EC: "-1",
          DT: ""
        });
      }
    }
    // create +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    else if (req.body.status === "create") {
      console.log(req.body.status)
      let form;
      if (err) {
        console.log(err);
        return res.status(200).json({
          EM: "error from server",
          EC: "-1",
          DT: ""
        });
      }
      else if (!req.files.thumbnail || !req.files.thumbnailHasText || !req.files.thumbnailR) {
        return res.status(200).json({
          EM: "ảnh không được để trống",
          EC: "-1",
          DT: ""
        });
      } else if (req.body.genrename === "" || req.body.genrename === null || req.body.genrename === undefined) {
        return res.status(200).json({
          EM: "không được để trống",
          EC: "-1",
          DT: ""
        });
      }
      else {
        const genrename = req.body.genrename;
        const state = req.body.state;
        const description = req.body.description;
        const thumbnailFile = req.files.thumbnail[0];
        const thumbnailHasTextFile = req.files.thumbnailHasText[0];
        const thumbnailRFile = req.files.thumbnailR[0];

        const thumbnailBase64 = thumbnailFile.buffer.toString("base64");
        const thumbnailHasTextBase64 = thumbnailHasTextFile.buffer.toString("base64");
        const thumbnailRBase64 = thumbnailRFile.buffer.toString("base64");

        let thumbnailUrl;
        let thumbnailHasTextUrl;
        let thumbnailRUrl;
        // Bổ xung các câu điều kiện kiểm tra tính tồn tại của file và songLink
        if (thumbnailBase64 && thumbnailHasTextBase64 && thumbnailRBase64) {
          try {
            const thumbnailResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailBase64);
            thumbnailRUrl = thumbnailResult.secure_url;
            const thumbnailHasTextResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailHasTextBase64);
            thumbnailHasTextUrl = thumbnailHasTextResult.secure_url;
            const thumbnailRResult = await cloudinary.uploader.upload("data:image/png;base64," + thumbnailRBase64);
            thumbnailUrl = thumbnailRResult.secure_url;
          } catch (error) {
            console.log("Failed to upload file:", error);
          }
        }
        else {
          console.log("Failed to upload file:");
        }
        const newIDSong = uuidv4().substring(0, 8).toUpperCase();
        form = {
          genreId: newIDSong,
          genrename: genrename,
          thumbnail: thumbnailUrl,
          thumbnailHasText: thumbnailHasTextUrl,
          thumbnailR: thumbnailRUrl,
          state: 0,
          description: description,
          listen: 0,
          playListId: []
        };
      }
      let data
      try {
        const existingGenre = await genre.findOne({ genrename: form.genrename });
        if (existingGenre) {
          return res.status(200).json({
            EM: "Tên thể loại đã tồn tại",
            EC: "-1",
            DT: ""
          });
        } else {
          data = await genre.create(form);
          console.log("data", data);
        }
      } catch (error) {
        console.log("Failed to create genre:", error);
        return res.status(200).json({
          EM: "error from server",
          EC: "-1",
          DT: ""
        });
      }

      if (data) {
        return res.status(200).json({
          EM: "thêm mới thể loại thành công",
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
      const genres = await genre.findOne({ genreId: req.body.genreId });
      if (genres) {
        const newState = genres.state === 1 ? 0 : 1;
        data = await genre.updateOne({ genreId: req.body.genreId }, { state: newState });
        // Kiểm tra xem cập nhật đã thành công hay không
        if (data.modifiedCount > 0) {
          return res.status(200).json({
            EM: `đã chuyển trạng thái từ ${genres.state === 1 ? "ẩn" : "hiển thị"} sang ${newState === 1 ? "ẩn" : "hiển thị"}`,
            EC: "0",
            DT: data
          });
        } else {
          return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: "No update made"
          });
        }
      } else {
        return res.status(200).json({
          EM: "error from server 1",
          EC: "-1",
          DT: "Song not found"
        });
      }
    }
  });
};

module.exports = {
  adminG
};