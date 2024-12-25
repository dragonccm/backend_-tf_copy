const { getPlaylistRankListen } = require('../services/getdatePlaylitstRankListen_service');

const getPlaylistRankListenControl = async (req, res) => {
  const idata = req.body;
  const data = await getPlaylistRankListen(idata);
  if (data.EC == "0") {
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
}

module.exports = {
  getPlaylistRankListenControl
}

