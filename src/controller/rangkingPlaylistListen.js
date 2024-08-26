import { getPlaylistRank } from "../services/getdatePlaylitstRankListen_service.js"

const getPlaylistRankListenControl = async (req, res) => {
  const playlistId = req.params.id;
  const data = await getPlaylistRank(playlistId)
  if (data.EC == "0") {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: data.DT },
    });
  }
}

module.exports = {
  getPlaylistRankListenControl
}

