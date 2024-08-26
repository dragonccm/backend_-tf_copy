import { restCommentService } from "../services/restComment-service";
const restComment = async (req, res) => {
  const data = req.body.data;
  const userId = data.userId;
  let datas;
    if (data.status === "create") {
        console.log(data.data.userId)
    datas = await restCommentService(data, data.data.userId ? data.data.userId : null);
  } else {
    datas = await restCommentService(data, userId ? userId : null);
  }
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
  restComment,
};
