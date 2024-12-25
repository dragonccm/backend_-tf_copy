import { getSongRankListen,getRankMoth } from "../services/getdateSongRankListen_service.js";

const getSongRankListenControl = async (req, res) => {
  const songId = req.params.id;
  const range = req.params.range;
  const start = req.params.start;
  const data = await getSongRankListen(songId, range, start);
  if (data.EC == "0") {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT:  data.DT,
    });
  } else {
    return res.status(400).json({
      EM: data.EM,
      EC: data.EC,
    });
  }
};
const getRankMothControl = async (req,res)=>{
  const data = await getRankMoth();
  if(data.EC == "0"){
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: data.DT,
    });
  }else{
    return res.status(400).json({
      EM: data.EM,
      EC: data.EC,
    });
  }
}
module.exports = {
  getSongRankListenControl,
  getRankMothControl
};

