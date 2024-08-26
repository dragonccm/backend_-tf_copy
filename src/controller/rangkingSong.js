import { getSongRank } from "../services/getdateSongRank_service.js"
const getSongRankControl = async (req, res) => {
  const songId = req.params.id;
  const data = await getSongRank(songId)
  if (data.EC == "0") {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: data.DT },
    });
  }
}


module.exports = {
  getSongRankControl
}

