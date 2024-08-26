import { getPlaylistRank } from "../services/getdatePlaylitstRank_service.js"
const getPlaylistRankControl = async (req, res) => {
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
  getPlaylistRankControl
}

