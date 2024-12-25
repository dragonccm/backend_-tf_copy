import {
  getComments, editComments, createComments, deleteComments, reportComments
} from "../services/restComment-service";
import {getIO}  from "../socket/socketConfig.js";

const getComment = async (req, res) => {
  const id = req.params.id;
  const page = req.params.page;
  

    const datas = await getComments(id,page);

  if (datas && datas.EC == "0") {
    return res.status(200).json({
      EM: datas.EM,
      EC: "0",
      DT: datas.DT,
    });
  } else {
    return res.status(200).json({
      EM: datas.EM,
      EC: datas.EC,
      DT: "",
    });
  }
};
const editComment = async (req, res) => {
    const datas = await editComments(req.body.data, req.user.id);

  if (datas && datas.EC == "0") {
    const io = getIO();
    io.emit('edit_comment', datas.DT);
    return res.status(200).json({
      EM: datas.EM,
      EC: "0",
      DT: datas.DT,
    });
  } else {
    return res.status(200).json({
      EM: datas.EM,
      EC: datas.EC,
      DT: "",
    });
  }
};
const createComment = async (req, res) => {
const data = req.body.data
    const datas = await createComments(data,req.user.id);

  if (datas && datas.EC == "0") {
    const io = getIO();
    io.emit('new_comment', datas.DT);
    return res.status(200).json({
      EM: datas.EM,
      EC: "0",
      DT: datas.DT,
    });
  } else {
    return res.status(200).json({
      EM: datas.EM,
      EC: datas.EC,
      DT: "",
    });
  }
};
const deleteComment = async (req, res) => {
  const id = req.body.id;
  
    const datas = await deleteComments(id,req.user.id);
  if (datas && datas.EC == "0") {
    const io = getIO();
    io.emit('delete_comment', datas.DT);
    return res.status(200).json({
      EM: datas.EM,
      EC: "0",
      DT: datas.DT,
    });
  } else {
    return res.status(200).json({
      EM: datas.EM,
      EC: datas.EC,
      DT: "",
    });
  }
};
const reportComment = async (req, res) => {
  const id = req.body.id;
  
    const datas = await reportComments(id,req.user.id);
  if (datas && datas.EC == "0") {
    return res.status(200).json({
      EM: datas.EM,
      EC: "0",
      DT: datas.DT,
    });
  } else {
    return res.status(200).json({
      EM: datas.EM,
      EC: datas.EC,
      DT: "",
    });
  }
};


module.exports = {
getComment,editComment,createComment,deleteComment,reportComment
};
