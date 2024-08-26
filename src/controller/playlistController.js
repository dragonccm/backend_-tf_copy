const { Nuxtify } = require("nuxtify-api")
const Playlist = require('../models/playlist_model');
import {getPlaylist,RelatedPlaylist } from '../services/playlist-services'
const fetchPlaylist = async (req, res) => {
    const id = req.params.id;
    try {
        const songly = await Nuxtify.getPlaylist(id);
        const data = await getPlaylist(id)
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: {te:songly,data:data.DT},
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
            DT: {data:data.DT},
          });
    } catch (error) {
        console.log(error);
        res.status(200).send(`Failed to get playlist: ${error.message}`);
    }
}


module.exports = {
    fetchPlaylist,getRelatedPlaylist
};