const { Nuxtify } = require("nuxtify-api")
import {getSong,getSongRelated} from "../services/song-services"
const songdetail = async (req, res) => {
    const songId = req.params.id;
    const data = await getSong(songId)
    const SongDetail = await Nuxtify.song.getDetail(songId);

    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: {te:SongDetail,data:data.DT},
          });
    }
}
const songPage = async (req, res) => {
    const songId = req.params.id;
    const data = await getSongRelated(songId)

    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: data.DT,
          });
    }
}
module.exports = {
    songdetail,
    songPage
}