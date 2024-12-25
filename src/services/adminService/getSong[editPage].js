import Song from "../../models/sonng_model.js";
const genre = require('../../models/genre_model.js');
const Ar = require('../../models/artists_model');



const getSongEditPage = async (id) => {
    try {
        const song = await Song.findOne({ id: id });
        if (song) {
            const format = {
                id: song.id,
                songname: song.songname,
                artist: (await Ar.find({ id: { $in: song.artists } },{id:1,artistsName:1}).exec()) ?? "",
                genre: (await genre.find({ genreId: { $in: song.genresid } },{genreId:1,genrename:1}).exec()) ?? "",
                lyric: song.lyric,
                songLink: song.songLink,
                thumbnail: song.thumbnail,
                listen: song.listen,
                like: song.like,
                createdAt: song.createdAt
            };
            return {
                EM: "Lấy danh thể tìm kiếm thành công!",
                EC: "0",
                DT: {
                    songs: format,
                },
            };
        } else {
            return {
                EM: "Không lấy tìm được!",
                EC: "-1",
                DT: "",
            };
        }

    } catch (err) {
        console.log(err);
        return {
            EM: "Không lấy tìm được!",
            EC: "-1",
            DT: "",
        };
    }
};



module.exports = {
    getSongEditPage
};