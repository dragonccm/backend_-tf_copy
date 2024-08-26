const Song = require("../models/sonng_model");
const Playlist = require("../models/playlist_model");
const Ar = require("../models/artists_model");
const genre = require("../models/genre_model");
const moment = require("moment");
const { Nuxtify } = require("nuxtify-api");
const fetchclone = async (_, res) => {
    try {
        try {
            const response = await Nuxtify.song.getDetail("Z6FE8WOC");
            const Lyric = await Nuxtify.song.getLyrics("Z6FE8WOC");
            const LinkSong = await Nuxtify.song.getUrl("Z6FE8WOC");
            if (response && response.data) {
                const song = response.data;
                console.log(song.like);

                const like = song.like;
                const listen = song.listen;
                const artistInfo = song.artists ? song.artists : [""];

                const alias = song.alias ? song.alias : "Unknown Artist";
                const duration = song.duration || 20;

                const songname = song.title || "Untitled Song";
                const img =
                    song.thumbnailM ||
                    "https://i.pinimg.com/736x/a7/a6/9d/a7a69d9337d6cd2b8b84290a7b9145ad.jpg";

                const songlink =
                    LinkSong.data["128"] ||
                    "https://a128-z3.zmdcdn.me/c2e3abd902697240cf99ffb93e9e38f3?authen=exp=1712376116~acl=/c2e3abd902697240cf99ffb93e9e38f3/*~hmac=d9866bb2a2216c3ce17a63244b18dde1";
                const Ly = song.lyric;
                const Li = Lyric.data ? Lyric.data.sentences : [];

                const jj = {
                    id: song.encodeId,
                    thumbnail: img,
                    songname: songname,
                    artists: artistInfo,
                    alias: alias,
                    songLink: songlink,
                    listen: listen,
                    like: like,
                    duration: duration,
                    lyric: Li,
                    genresid: ["IWZ9Z0BO"],
                };

                try {
                    const updatedSong = await Song.findOneAndUpdate(
                        { id: jj.id },
                        jj,
                        { new: true, upsert: true }
                    );
                    console.log("Bản ghi đã được cập nhật:", updatedSong);
                } catch (error) {
                    console.error("Lỗi khi cập nhật bản ghi:", error);
                }

                res.status(200).send(song);
            }
        } catch (error) {
            console.log(`Error fetching song detail for id`, error);
            return null;
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};
const fetchplaylistclone = async (req, res) => {
    try {
        const id = req.body.data.playlistId;
        const playlistData = req.body.data;

        const existingPlaylist = await Playlist.findOne({ playlistId: id });
        if (existingPlaylist) {
            // Playlist already exists, update the data
            // await Playlist.findOneAndUpdate({ playlistId: id }, playlistData, { upsert: true });

            // Update the playlist data in MongoDB
            const newww = await Playlist.updateOne(
                { playlistId: id },
                playlistData
            );
            console.log("Playlist updated successfully");
            res.json(newww);
        } else {
            // Playlist doesn't exist, insert the data
            // await Playlist.create(playlistData);

            // Insert the playlist data into MongoDB
            const newww = await Playlist.create(playlistData);
            console.log("New playlist inserted successfully");
            res.json(newww);
        }
    } catch (err) {
        console.log(err);
        // res.status(500).json({ error: "Something went wrong" });
    }
};

const fetchArtistsClone = async (req, res) => {
    try {
        const id = req.body.data.id;
        console.log(id);
        const artistsData = req.body.data;
        const updatedartists = await Ar.findOneAndUpdate(
            { id: id },
            artistsData,
            {
                upsert: true,
            }
        );
        res.json(updatedartists);
    } catch (err) {
        console.log("Artists Clone ERROR", err);
    }
};

const fetchSongData = async (req, res) => {
    const SongId = req.body.id;
    try {
        const detail = await Nuxtify.song.getDetail(SongId);
        if (Array.isArray(detail.data.artists) && detail.data) {
            const artistIds = Array.isArray(detail.data.artists)
                ? detail.data.artists.map((artist) => artist.alias)
                : [];
            const artists = await Promise.all(
                artistIds.map((alias) => Nuxtify.getArtist(alias))
            );

            const result = await Promise.all(
                artists.map(async (ar) => {
                    const sections = ar.data.sections;
                    const songListIds = sections.flatMap((section) =>
                        section.items
                            ? section.items.map((item) =>
                                  item.encodeId ? item.encodeId : null
                              )
                            : []
                    );
                    const filteredSongListIds = await Song.find(
                        { id: { $in: songListIds } },
                        { id: 1, _id: 0 }
                    ).distinct("id");

                    return {
                        id: ar.data.id,
                        artistsName: ar.data.name,
                        alias: ar.data.alias,
                        biography: ar.data.biography,
                        avt: ar.data.thumbnail,
                        birthday: ar.data.birthday,
                        realName: ar.data.realname,
                        totalFollow: ar.data.totalFollow,
                        songListId: filteredSongListIds,
                        playListId: [ar.data.playlistId],
                    };
                })
            );
            console.log("================================", result[0].alias);
            res.json(result);
        } else {
            res.json({});
        }
    } catch (err) {
        console.error("Error fetching playlist data", err);
        throw err;
    }
};
const fetchAutoCloneGenre = async (req, res) => {
    try {
        const songId = await Song.find({}, { id: 1, _id: 0 });
        console.log(songId.length);
        const nsew = songId.map((data) => data.id);
        res.json({ songId: nsew });
    } catch (err) {
        console.error("Artists Clone ERROR", err);
    }
};

module.exports = {
    fetchclone,
    fetchplaylistclone,
    fetchArtistsClone,
    fetchAutoCloneGenre,
    fetchSongData,
};
