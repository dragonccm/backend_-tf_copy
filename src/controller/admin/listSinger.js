const Song = require('../../models/sonng_model');
const Ar = require('../../models/artists_model');


const adminAr = async (req, res) => {
    const limit = req.params.id;
    try {

        // Truy vấn dữ liệu nghệ sĩ sau khi xóa trùng lặp
        const artistCount = await Ar.countDocuments({});
        const artistData = await Ar.find({}, {
            id: 1,
            avt: 1,
            artistsName: 1,
            alias: 1,
            realName: 1,
            biography: 1,
            birthday: 1,
            totalFollow: 1,
            songListId: 1,
            playListId: 1,
            createdAt: 1,
            state: 1,
            _id: 0,
        }).sort({ _id: -1 }).skip(+limit).limit(10);

        // const songData = await Promise.all(artistData.map(async (artist) => {
        //     const songListNames = await Promise.all(artist.songListId.map(async (songId) => {
        //         await Song.findOne({ id: songId }, { alias: 1, _id: 0 });
        //     }));
        //     return { ...artist.toObject(), songListId: songListNames };
        // }));

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