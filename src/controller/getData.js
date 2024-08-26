const { Nuxtify } = require("nuxtify-api");
const Ar = require("../models/artists_model");
const Song = require("../models/sonng_model");
const Playlist = require("../models/playlist_model");

const getartist = async (req, res) => {
    const getSongmp3 = async () => {
        // const url = await Nuxtify.getArtist('Jisoo');
        const url = await Nuxtify.song.getSongDetail("Z6709W0Z");
        const timestamp = 1708862634884;
        const date1 = new Date(23960);

        const startTime = 20500;

        const timestampSeconds = Math.floor(timestamp / 1000); // Chuyển đổi timestamp thành giây

        const diffSeconds = timestampSeconds - startTime; // Tính hiệu giữa timestamp và startTime

        const date2 = new Date(diffSeconds);

        const seconds2 = date2.getSeconds();
        const seconds1 = date1.getSeconds();

        console.log("Seconds1:", seconds1);
        console.log("Seconds2:", seconds2);

        console.log(date2);
        return res.json(url);
    };
    getSongmp3();
};

const songdetail = async (req, res) => {
    const songId = req.params.id;
    const SongDetail = await Nuxtify.song.getDetail(songId);
    res.json(SongDetail);
};

const songurl = async (req, res) => {
    const songId = req.params.id;
    const songUrl = await Nuxtify.song.getUrl(songId);
    res.json(songUrl);
};

const songly = async (req, res) => {
    const songId = req.params.id;
    const songLyrics = await Nuxtify.song.getLyrics(songId);
    res.json(songLyrics);
};

const gethome = async (req, res) => {
    const getSongmp3 = async () => {
        const songly = await Nuxtify.getHome();
        return res.json(songly);
    };
    getSongmp3();
};

const getArtist = async (req, res) => {
    const artistId = req.params.id;
    await Ar.findOne({ alias: artistId }).then(async (data) => {
        if (data) {
            const songListId = data.songListId;
            const playListId = data.playListId;
            console.log(songListId);
            for (let i = 0; i < songListId.length; i++) {
                const song = await Song.findOne({ id: songListId[i] }).select("songname thumbnail id artists");
                if (song) {
                    data.songListId[i] = song;
                }
            }
            for (let i = 0; i < playListId.length; i++) {
                const playlist = await Playlist.findOne({ playlistId: playListId[i] }).select("playlistname thumbnail playlistId");
                if (playlist) {
                    data.playListId[i] = playlist;
                }
            }
            return res.json(data);
        } else {
            const getSongmp3 = async () => {
                const songly = await Nuxtify.getSongDetail(data.songListId);
                return res.json(songly);
            };
            getSongmp3();
        }
    });
};

const get100 = async (req, res) => {
    const getSongmp3 = async () => {
        const songly = await Nuxtify.getTop100();
        return res.json(songly);
    };
    getSongmp3();
};

const search = async (req, res) => {
    // const getSongmp3 = async () => {
    //     const songId = req.params.id;
    //     const songly = await Nuxtify.search.getSuggestion(songId);
    //     return res.json(songly);
    // };
    // getSongmp3();
    const searchterm = async () => {
        try {
            const keyword = req.params.id;
            const artistResults = await Ar.find({ alias: { $regex: keyword, $options: "i" } }, { artistsName: 1, avt: 1, id: 1 }).limit(5);
            const playlistResults = await Playlist.find({ playlistname: { $regex: keyword, $options: "i" } }, { thumbnail: 1, playlistId: 1, playlistname: 1, artistsId: 1 }).limit(5);
            const songResults = await Song.find({ songname: { $regex: keyword, $options: "i" } }, { thumbnail: 1, songname: 1, id: 1, artists: 1 }).limit(5);

            const results = [...artistResults.map(artist => ({ ...artist._doc, type: 4 })), ...playlistResults.map(playlist => ({ ...playlist._doc, type: 3 })), ...songResults.map(song => ({ ...song._doc, type: 1 }))];
            return res.json(results);

        } catch (error) {
            console.error(error);
            return res.json(error);
        }
    };
    searchterm()
};

module.exports = {
    getartist,
    songly,
    songurl,
    songdetail,
    gethome,
    getArtist,
    get100,
    search,
};
