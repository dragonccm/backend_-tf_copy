import { addHistory, getMyHistory } from "../services/history-services";

const addToHistory = async (req, res) => {
  try {
    if (req.body.data.id) {
      let data = await addHistory(req.user.id, req.body.data);

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
const getHistory = async (req, res) => {
  try {
      const myHistory = await getMyHistory(req.user.id);
    if (myHistory) {
      return res.status(200).json({
        EM: myHistory.EM,
        EC: "0",
        DT: myHistory.DT,
      });
    } else {
      return res.status(200).json({
        EM: 'lỗi',
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
  addToHistory,
  getHistory,
};
