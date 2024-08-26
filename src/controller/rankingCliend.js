import { getPlaylistRankMonth,getPlaylistRankWeek,addRanking } from "../services/rankCliend.js"
const getRankMonth = async (req, res) => {
  const data = await getPlaylistRankMonth()
  const dataWKorea = await getPlaylistRankWeek('kpop')
  const dataWUs = await getPlaylistRankWeek('us-uk')
  const dataWVi = await getPlaylistRankWeek('vn')
  if (data.EC == "0") {
    return res.status(200).json({
      EM: data.EM,
      EC: "0",
      DT: { data: {newRelease:data.DT,weekChart:{korea:dataWKorea.DT,us:dataWUs.DT,vn:dataWVi.DT}}},
    });
  }
}
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
    getRankMonth,addHistoryRank
}

