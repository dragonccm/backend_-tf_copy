const Playlist = require('../../models/playlist_model');

const adminPlaylist = async (req, res) => {
    const limit = req.params.id;
    try {
        // Truy vấn dữ liệu bài hát sau khi xóa trùng lặp
        const songCount = await Playlist.countDocuments({});
        const PlaylistData = await Playlist.find({}, {
            playlistId:1,
            playlistname:1,
            genresid:1,
            artistsId:1,
            thumbnail:1,
            type:1,
            description:1,
            songid:1,
            like:1,
            listen:1,
            state:1,
            _id: 0
        }).sort({ _id: -1 }).skip(+limit).limit(10);

        const handledata = await Promise.all(PlaylistData.map(async (playlist) => {
            // const genresNames = await Promise.all(
            //     playlist.genresid.map(async (genresid) =>
            //         await Genres.findOne({ genreId: genresid }, { genrename: 1, _id: 0 })
            //     ));
            // const artistsNames = await Promise.all(
            //     playlist.artists.map(async (artistsid) =>
            //         await Ar.findOne({ id: artistsid }, { artistsName: 1, _id: 0 })
            //     ));

            return { ...playlist.toObject()};
        }));

        const responseData = { handledata, maxPage: songCount };
        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    adminPlaylist
};