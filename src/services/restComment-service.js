import Comment from "../models/comment_model";
import User from "../models/user_model";
import mongoose, { Types } from "mongoose";

const restCommentService = async (data, userId) => {
  if (userId) {
    console.log(data)
    if (data.status === "create") {
      if (
        data.data.comments === "" ||
        data.data.comments === null ||
        data.data.comments === undefined
      ) {
        return {
          EM: "comment không được để trống!",
          EC: "-1",
          DT: "",
        };
      } else {
        const datas = await Comment.create({
          songId: data.data.id,
          content: data.data.comments,
          userId: data.data.userId,
        });
        if (!datas) {
          return {
            EM: "thêm comment thất bại!",
            EC: "-1",
            DT: "",
          };
        } else {
          return {
            EM: "thêm comment thành công!",
            EC: "0",
            DT: datas,
          };
        }
      }
    } else if (data.status === "read") {
      const datas = await Comment.find({
        songId: data.data,
        reportCount: { $lte: 5 },
      }).then((comments) => {
        const modifiedComments = comments.map(async (comment) => {
          const user = await User.findOne({ id: comment.userId });
          if (comment.userId === userId) {
            return {
              ...comment._doc,
              isOwnComment: true,
              userName: user.username,
              userAvt: user.avt,
            };
          } else {
            return {
              ...comment._doc,
              userName: user.username,
              userAvt: user.avt,
            };
          }
        });
        return Promise.all(modifiedComments);
      });
      if (!datas) {
        return {
          EM: "lấy comment thất bại!",
          EC: "-1",
          DT: "",
        };
      } else {
        return {
          EM: "lấy comment thành công!",
          EC: "0",
          DT: datas,
        };
      }
    } else if (data.status === "report") {
      const cmtId = new mongoose.Types.ObjectId(data.data);
      try {
        const comment = await Comment.findById(cmtId);
        if (!comment) {
          return {
            EM: "Không tìm thấy comment!",
            EC: "-1",
            DT: "",
          };
        }
        const userIdIndex = comment.ban.indexOf(userId);
        if (userIdIndex === -1) {
          comment.ban.push(userId);
          comment.reportCount += 1;
          await comment.save();
        } else {
          return {
            EM: "Bạn đã báo cáo comment này rồi!",
            EC: "2",
            DT: "",
          };
        }
        return {
          EM: "Báo cáo comment thành công!",
          EC: "0",
          DT: "",
        };
      } catch (error) {
        console.error(error); // Log the error for debugging
        return {
          EM: "Lỗi khi báo cáo comment!",
          EC: "-1",
          DT: "",
        };
      }
    }
  } else {
    if (data.status === "create") {
      return {
        EM: "không thể cmt !",
        EC: "-1",
        DT: "",
      };
    } else if (data.status === "read") {
      const datas = await Comment.find({
        songId: data.data,
        reportCount: { $lte: 5 },
      }).then((comments) => {
        const modifiedComments = comments.map(async (comment) => {
          const user = await User.findOne({ id: comment.userId });
          return {
            ...comment._doc,
            userName: user.username,
            userAvt: user.avt,
          }
        });
        return Promise.all(modifiedComments);
      });
      if (!datas) {
        return {
          EM: "lấy comment thất bại!",
          EC: "-1",
          DT: "",
        };
      } else {
        return {
          EM: "lấy comment thành công!",
          EC: "0",
          DT: datas,
        };
      }
    } else if (data.status === "report") {
      return {
        EM: "chua dang nhap!",
        EC: "-1",
        DT: "",
      };
    }
  }
};

module.exports = { restCommentService };
