const Ar = require('../../models/artists_model');


const adminAr = async (req, res) => {
    const limit = req.params.id;
    try {
        const artistCount = await Ar.countDocuments({});
        const artistData = await Ar.aggregate([
            { $sort: { _id: -1 } },
            { $skip: +limit },
            { $limit: 10 },
            // {
            //     $lookup: {
            //         from: 'songs',
            //         localField: 'songListId',
            //         foreignField: 'id',
            //         as: 'songListId'
            //     }
            // },
            // {
            //     $lookup: {
            //         from: 'playlists',
            //         localField: 'playListId',
            //         foreignField: 'playlistId',
            //         as: 'playListId'
            //     }
            // },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    avt: 1,
                    artistsName: 1,
                    alias: 1,
                    realName: 1,
                    biography: 1,
                    birthday: 1,
                    songListId: 1,
                    playListId:1,
                    // songListNames: { id: 1, songname: 1, thumbnail: 1 },
                    // playListNames: { playlistId: 1, playlistname: 1, thumbnail: 1 },
                    createdAt: 1,
                    state: 1
                }
            }
        ]);

        const responseData = { handleData: artistData, maxPage: artistCount };
        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    adminAr
};