import {
  getInfor,
  updateInfor,
  changepassword,
  resetpassword,
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
  myPlayLists,
  deleteMyPlaylist,
} from "../services/User_service";
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "drupmc7qd",
  api_key: "725439635389318",
  api_secret: "c52-kr9-K0JKIQVNLQNZnSD5FRs",
});
const multer = require("multer");

const Infor = async (req, res) => {
  try {
    let data = await getInfor(req.user.id);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: "Infor User get successfully",
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: "error from server",
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file"); // 'file' tương ứng với tên field trong form data khi gửi từ client
const editInfor = async (req, res) => {
  try {
    // Xử lý yêu cầu `multipart/form-data` sử dụng multer
    upload(req, res, async function (err) {
      let form;
      if (err) {
        // Xử lý lỗi khi tải lên
        console.log(err);
        return res.status(200).json({
          EM: "error from server",
          EC: "-1",
          DT: "",
        });
      } else if (!req.file) {
        form = {
          infor: {
            email: req.body.email,
            birthday: req.body.birthday,
          },
        };
      } else {
        const file = req.file;
        // Chuyển Buffer sang base64
        const fileBase64 = file.buffer.toString("base64");
        let imageUrl;
        try {
          imageUrl = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              "data:image/png;base64," + fileBase64,
              function (error, result) {
                if (error) {
                  console.log("Error uploading file:", error);
                  reject(error);
                } else {
                  console.log("Uploaded file details:", result);
                  // Lấy URL an toàn của hình ảnh đã tải lên
                  const secureUrl = result.secure_url;

                  // Tiếp tục xử lý với URL hình ảnh
                  resolve(secureUrl);
                }
              }
            );
          });
        } catch (error) {
          // Xử lý lỗi nếu có
          console.log("Failed to upload image:", error);
        }
        form = {
          infor: {
            email: req.body.email,
            birthday: req.body.birthday,
            avt: imageUrl,
          },
        };
      }
      let data = await updateInfor(form, req.user.id);

      if (data && data.EC == "0") {
        return res.status(200).json({
          EM: data.EM,
          EC: "0",
          DT: data.DT,
        });
      } else {
        return res.status(200).json({
          EM: "error from server",
          EC: "-1",
          DT: "",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const changePass = async (req, res) => {
  try {
    let data = await changepassword(req.body, req.user.id);

    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const resetPass = async (req, res) => {
  try {
    if (
      !req.body.cfPassword ||
      !req.body.newPassword ||
      req.body.cfPassword !== req.body.newPassword
    ) {
      return res.status(404).json({
        EM: data.EM,
        EC: "-1",
        DT: "Dữ liệu không đúng",
      });
    } else {
      const id = req.cookies.userIdentifier;
      let data = await resetpassword(req.body, id);

      if (data && data.EC == "0") {
        res.clearCookie("userIdentifier");
        return res.status(200).json({
          EM: data.EM,
          EC: "0",
          DT: data.DT,
        });
      } else {
        return res.status(200).json({
          EM: data.EM,
          EC: "-1",
          DT: "",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const updateBanSongs = async (req, res) => {
  try {
    const songId = req.body.songId;

    let data = await addBanSong(songId, req.user.id);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const addLikeSomething = async (req, res) => {
  try {
    // console.log(JSON.stringify(req.body));
    let data = await addLike(req.body.data, req.user.id);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const unLikeSomething = async (req, res) => {
  try {
    // console.log(JSON.stringify(req.body));
    // console.log(req.user);
    let data = await unLike(req.body.data, req.user.id);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const getMyPl = async (req, res) => {
  try {
    let data = await getMyPlaylist(req.user.id);

    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const createMyPl = async (req, res) => {
  try {
    const playlistname = req.body.data.playlistname;

    if (playlistname) {
      let data = await createMyPlaylist(req.user, playlistname);

      if (data && data.EC == "0") {
        return res.status(200).json({
          EM: data.EM,
          EC: "0",
          DT: data.DT,
        });
      } else {
        return res.status(200).json({
          EM: data.EM,
          EC: "-1",
          DT: "",
        });
      }
    } else {
      return res.status(200).json({
        EM: "Hãy tạo tên playlist",
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const addToPlaylist = async (req, res) => {
  try {
    const dataAdd = req.body.data;
    let data = await addToMyPlaylist(req.user.id, dataAdd);

    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const getAllUs = async (req, res) => {
  try {
    let data = await getAllUser(req.params.id);

    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const getAlGenre = async (req, res) => {
  try {
    let data = await getGenres(req.params.id);

    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

const adminHome= async(req, res) => {
  try {
    let data = await adminHomeService();
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const userGetLikeSongs = async (req, res) => {
  try {
    let data = await getMylikesSongs(req.user.id);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const changeRoleCtrl = async (req, res) => {
  try {
    let data = await changeRole(req.body.data);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const deleteMyPl = async (req, res) => {
  try {
    const dataAdd = req.body.data.playlistId;
    console.log("adasdasdasdas", dataAdd);
    let data = await deleteMyPlaylist(req.user.id, dataAdd);
    if (data && data.EC == "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: data.EM,
        EC: "-1",
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
module.exports = {
  Infor,
  editInfor,
  changePass,
  updateBanSongs,
  addLikeSomething,
  unLikeSomething,
  getMyPl,
  createMyPl,
  addToPlaylist,
  getAllUs,
  getAlGenre,
  adminHome,
  userGetLikeSongs,
  changeRoleCtrl,
  deleteMyPl,
  resetPass,
};
