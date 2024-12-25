import { getPlaylistRankMonth,getPlaylistRankWeek,addRanking } from "../services/rankCliend.js"
const getRating = async (req, res) => {
  const [data, weekChart] = await Promise.all([
    getPlaylistRankMonth(),
    getPlaylistRankWeek(),
  ]);
  // console.log(data);
  
  if (data.EC == "0" && weekChart.EC=="0" ) {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: {RTChart:data.DT,weekChart:weekChart.DT}},
    });
  }
};
const addHistoryRank = async (req, res) => {
  const data = await addRanking(req.body.id)
  if (data.EC == "0") {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: data.DT },
    });
  }
}
module.exports = {
    getRating,addHistoryRank
};
