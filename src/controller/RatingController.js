const { Nuxtify } = require("nuxtify-api");
import { getPlaylistRankMonth,getPlaylistRankWeek } from "../services/rankCliend.js"
const getRating = async (req, res) => {

  const data = await getPlaylistRankMonth()
  const weekChart = await getPlaylistRankWeek()
  if (data.EC == "0" && weekChart.EC=="0" ) {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: {RTChart:data.DT,weekChart:weekChart.DT}},
    });
  }
  // return res.status(200).json(url);
};


module.exports = {
    getRating,
};
