import { getPlaylistRank } from "../services/getdatePlaylitstRank_service.js";

const getPlaylistRankControl = async (req, res) => {
  const idata = req.body;
  try {
    const data = await getPlaylistRank(idata);
    if (data.EC === "0") {
      return res.status(200).json({
        EM: data.EM,
        EC: "0",
        DT: data.DT,
      });
    } else {
      return res.status(400).json({
        EM: data.EM,
        EC: data.EC,
      });
    }
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: "1",
    });
  }
};

module.exports = { getPlaylistRankControl };

