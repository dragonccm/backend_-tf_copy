import {
    searchSongs,
    searchGenre,
    searchPlaylist,
    searchUser,
    searchArtists,
} from "../../services/adminService/search.js"

const searchSongsCtrl = async (req, res) => {
    const playlistId = req.body.data;
    const data = await searchSongs(playlistId)
    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: { data: data.DT },
        });
    }
}
const searchGenreCtrl = async (req, res) => {
    const datares = req.body.data;
    const data = await searchGenre(datares)
    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: { data: data.DT },
        });
    }
}
const searchPlaylistCtrl = async (req, res) => {
    const datares = req.body.data;
    const data = await searchPlaylist(datares)
    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: { data: data.DT },
        });
    }
}
const searchUserCtrl = async (req, res) => {
    const datares = req.body.data;
    const data = await searchUser(datares)
    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: { data: data.DT },
        });
    }
}
const searchArtistsCtrl = async (req, res) => {
    const datares = req.body.data;
    const data = await searchArtists(datares)
    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: { data: data.DT },
        });
    }
}


module.exports = {
    searchSongsCtrl,
    searchGenreCtrl,
    searchPlaylistCtrl,
    searchUserCtrl,
    searchArtistsCtrl,
}