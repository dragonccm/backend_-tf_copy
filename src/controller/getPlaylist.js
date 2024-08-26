const { Nuxtify } = require("nuxtify-api")
const Playlist = require('../models/playlist_model');

const fetchPlaylist = async (req, res) => {
    const id = req.params.id;
    try {
        const songly = await Nuxtify.getPlaylist(id);
        // await Playlist.findOneAndUpdate(
        //     { playlistId: id },
        //     { $inc: { listen: 10 } },
        //     { upsert: true }
        // );
        return res.json(songly);
    } catch (error) {
        res.status(200).send(`Failed to get playlist: ${error.message}`);
    }
}


module.exports = {
    fetchPlaylist,
};