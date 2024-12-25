const Playlist = require('../../models/playlist_model');
const Genres = require('../../models/genre_model');
const Ar = require('../../models/artists_model');
const Song = require('../../models/sonng_model');

const adminPlaylist = async (req, res) => {
    const limit = req.params.id;
    try {
        const songCount = await Playlist.countDocuments({});
        const PlaylistData = await Playlist.aggregate([
            { $sort: { _id: -1 } },
            { $skip: +limit },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genresid',
                    foreignField: 'genreId',
                    as: 'genresNames'
                }
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'artistsId',
                    foreignField: 'id',
                    as: 'artistsNames'
                }
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: 'songid',
                    foreignField: 'id',
                    as: 'songDetails'
                }
            },
            {
                $project: {
                    _id: 0,
                    playlistId: 1,
                    playlistname: 1,
                    genresNames: { genreId: 1, thumbnail: 1, genrename: 1 },
                    artistsNames: { avt: 1, artistsName: 1, id: 1 },
                    songDetails: { id: 1, songname: 1, thumbnail: 1 },
                    thumbnail: 1,
                    type: 1,
                    description: 1,
                    like: 1,
                    listen: 1,
                    state: 1
                }
            }
        ]);

        const responseData = { handledata: PlaylistData, maxPage: songCount };
        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    adminPlaylist
};