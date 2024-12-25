const Song = require('../../models/sonng_model');
const Genres = require('../../models/genre_model');
const Ar = require('../../models/artists_model');

const adminSong = async (req, res) => {
    const limit = req.params.id;
    try {
        const songCount = await Song.countDocuments({});
        const songData = await Song.aggregate([
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
                    localField: 'artists',
                    foreignField: 'id',
                    as: 'artistsNames'
                }
            },
            {
                $project: {
                    _id: 0,
                    thumbnail: 1,
                    songname: 1,
                    genresNames: { genreId: 1, genrename: 1 },
                    listen: 1,
                    artistsNames: { id: 1, artistsName: 1 },
                    like: 1,
                    alias: 1,
                    songLink: 1,
                    id: 1,
                    createdAt: 1,
                    state: 1
                }
            }
        ]);

        const responseData = { handledata: songData, maxPage: songCount };
        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    adminSong
};