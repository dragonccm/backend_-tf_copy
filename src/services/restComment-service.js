import { ideahub } from "googleapis/build/src/apis/ideahub";
import Comment from "../models/comment_model";
import User from "../models/user_model";
import mongoose, { Types } from "mongoose";

const restCommentService = async (data, userId) => {
  if (userId) {
    // console.log(data);
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
          };
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
const getComments = async (id,page) => {
  const limit = 10;
  const skip = (page - 1) * limit;
  const countComment =  await Comment.countDocuments({
    songId: id,
    state: 0,
    parentId: null
  })
  const datas = await Comment.find({
    songId: id,state:0,parentId: null
  }) .skip(skip)
    .limit(limit).
    sort({ createdAt: -1 }).then((comments) => {
    const modifiedComments = comments.map(async (comment) => {
      const user = await User.findOne({ id: comment.userId });
      const replies = await Comment.find({
        parentId: comment._id, state: 0
      }).sort({ createdAt: 1 }).then((comments) => {
        const modifiedComments = comments.map(async (comment) => {
          const user = await User.findOne({ id: comment.userId });
          return {
            ...comment._doc,
            reply:replies,
            userID: user.id,
            userName: user.username,
            userAvt: user.avt,
          };
        })
        return Promise.all(modifiedComments);
      })
      return {
        ...comment._doc,
        reply:replies,
        userID: user.id,
        userName: user.username,
        userAvt: user.avt,
      };
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
    if (countComment > skip + 10) {
      return {
        EM: "lấy comment thành công!",
        EC: "0",
        DT: {comments:datas,hasMore:true},
      };
    } else {
      return {
        EM: "lấy comment thành công!",
        EC: "0",
        DT: {comments:datas,hasMore:false},
      };
    }
   
  }
};
const editComments = async (data,userId) => {
  try {
    const oldComment = await Comment.findOne({ _id: data.commentId });
    if (oldComment && oldComment.userId === userId && data.text.length>0) {
      oldComment.content = data.text;
      await oldComment.save();

      return {
        EM: "lấy comment thành công!",
        EC: "0",
        DT: oldComment,
      };
    } else {
      return {
        EM: "!",
        EC: "-1",
        DT: [],
      };
    }
  } catch (error) {
    console.error("Lỗi khi sửa bình luận:", error);
    return {
      EM: error,
      EC: "-1",
      DT: [],
    };
  }
};
const createComments = async (data,userId) => {
  try {
    if (!data.text) {
      return {
        EM: "comment không được để trống!",
        EC: "-1",
        DT: "",
      };
    } 

    const commentData = await Comment.create({
      songId: data.id,
      content: data.text,
      userId: userId,
      parentId: data.parentId || null,
    });

    // Sử dụng _id để tìm người dùng. Giả định rằng userId là _id của User trong MongoDB
    const user = await User.findOne({ id: commentData.userId });
const replies =  await Comment.find({ parentId: commentData.parentId});
    if (!user) {
      return {
        EM: "Không tìm thấy người dùng!",
        EC: "-1",
        DT: "",
      };
    }

    const responseData = {
      ...commentData._doc,
      userID: user._id, // Đảm bảo sử dụng _id nếu là MongoDB
      userName: user.username,
      userAvt: user.avt,
      replies:replies
    };

    return {
      EM: "thêm comment thành công!",
      EC: "0",
      DT: responseData,
    };  
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    return {
      EM: String(error),
      EC: "-1",
      DT: [],
    };
  }
};
const deleteComments = async (id,userId) => {
  try {
    const oldComment = await Comment.findOne({ _id: id, userId: userId });
    const parentId = oldComment.parentId || 'no parent';
    if (oldComment) {
      oldComment.state = 2;
      await oldComment.save();

      return {
        EM: "lấy comment thành công!",
        EC: "0",
        DT: oldComment,
      };
    } else {
      return {
        EM: "!",
        EC: "-1",
        DT: [],
      };
    }
  } catch (error) {
    console.error("Lỗi khi sửa bình luận:", error);
    return {
      EM: error,
      EC: "-1",
      DT: [],
    };
  }
};
const reportComments = async (id,userId) => {
  try {
    const comment = await Comment.findOne({ _id: id});
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
};

module.exports = {
  restCommentService,
  getComments,
  editComments,
  createComments,deleteComments,reportComments
};
