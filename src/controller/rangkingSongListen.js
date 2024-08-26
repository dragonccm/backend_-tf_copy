import { getSongRankListen } from "../services/getdateSongRankListen_service.js"
const getSongRankListenControl = async (req, res) => {
  const songId = req.params.id;
  const data = await getSongRankListen(songId)
  if (data.EC == "0") {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: data.DT },
    });
  }
}

module.exports = {
  getSongRankListenControl
}

