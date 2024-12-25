import {getPlaylist,RelatedPlaylist } from '../services/playlist-services'
const fetchPlaylist = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await getPlaylist(id)
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: data.DT,
          });
    } catch (error) {
        res.status(200).send(`Failed to get playlist: ${error.message}`);
    }
}

const getRelatedPlaylist = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await RelatedPlaylist(id)
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: data.DT,
          });
    } catch (error) {
        console.log(error);
        res.status(200).send(`Failed to get playlist: ${error.message}`);
    }
}


module.exports = {
    fetchPlaylist,getRelatedPlaylist
};