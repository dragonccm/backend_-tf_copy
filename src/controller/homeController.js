// const { Nuxtify } = require("nuxtify-api");
import {
  getNewRelease,
  getSongHot,
  getSongRemix,
  getSongChill,
  getSongTop100,
  getAlbumHot,
  getSongRating,
  getSongSad,
} from "../services/home-services";
const { Nuxtify } = require("nuxtify-api");
const { ZingMp3 } = require("zingmp3-api-full-v3");
const Song = require("../models/sonng_model");
const Playlist = require("../models/playlist_model");
const Artist = require("../models/artists_model");

const getRandomIds = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const handleHome = async (req, res) => {
  try {
    const id = "ZOB66FIU";
    // const playlist = await ZingMp3.getInfoSong("Z6DUFI9U");

    // async function updateThumbnails() {
    //   try {
    //     const docs = await Playlist.find({});

    //     for (const doc of docs) {
    //       const thumbnail = doc.thumbnail; // Lấy thumbnail hiện tại

    //       // Xử lý thumbnail
    //       const newThumbnail = thumbnail.replace("photow600ize", "photo-resize").replace("w94_r1x1", "w600_r1x1");;

    //       // Cập nhật thumbnail mới
    //       doc.thumbnail = newThumbnail;
    //       await doc.save(); // Sử dụng await để chờ kết quả của save()
    //       console.log('Thumbnail updated successfully:', doc.thumbnail);
    //     }
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

    // // updateThumbnails(); // Gọi hàm updateThumbnails()

    // const playlist = await updateThumbnails();

    // const playlist = await ZingMp3.getDetailPlaylist("6CZ8988O");
    // console.log(playlist.data.song);

    // if (playlist && playlist.data) {
    //   let songid = [];
    //   for (let i = 0; i < playlist.data.song["items"].length; i++) {
    //     songid.push(playlist.data.song["items"][i]["encodeId"]);
    //     const song = await ZingMp3.getInfoSong(
    //       playlist.data.song["items"][i]["encodeId"]
    //     );
    //     const link = await ZingMp3.getSong(
    //       playlist.data.song["items"][i]["encodeId"]
    //     );
    //     const lyric = await ZingMp3.getLyric(
    //       playlist.data.song["items"][i]["encodeId"]
    //     );
    //     if (song && song.data) {
    //       let artist = song.data.artists&&song.data.artists.length>0 &&song.data.artists.map((artist) => artist.id);
    //       // console.log(song.data.artists.map(artist => artist.id));
    //       console.log(song.data.genreIds);

    //       let genres = song.data&&song.data.genreIds?song.data.genreIds:[]
    //       genres.push('IWZ9Z08C')
    //       genres.push('IWZ9Z087')
    //       let form = {
    //         infor: {
    //           id: song.data.encodeId,
    //           songname: song.data.title,
    //           thumbnail: song.data.thumbnailM,
    //           alias: song.data.alias,
    //           artists: artist,
    //           genresid: genres,
    //           songLink: link && link.data && link.data["128"],
    //           duration: song.data.duration,
    //           lyric: lyric && lyric.data && lyric.data["sentences"],
    //           like: getRandomNumber(100, 5000),
    //           listen: getRandomNumber(100, 5000),
    //         },
    //       };
    //       // if (link && link.data && link.data["128"]) {
    //         let datas = await Song.findOneAndUpdate(
    //           { id: form.infor.id },
    //           form.infor,
    //           { upsert: true, new: true }
    //         );
    //       // }
    //       let data = await Playlist.findOneAndUpdate(
    //         { playlistId: playlist.data.encodeId },
    //         {
    //           playlistId: playlist.data.encodeId,
    //           playlistname: playlist.data.title,
    //           genresid: ["IWZ9Z087","IWZ9Z08C"],
    //           thumbnail: playlist.data.thumbnailM,
    //           description: playlist.data.sortDescription,
    //           songid: songid,
    //           type: 'album',
    //           artistsId:[playlist.data.artists[0].id]
    //         },
    //         { upsert: true, new: true }
    //       );
    //     }
    //   }
    // }
    const songs = await Song.find({}).skip(3999).limit(1000);
    songs.map(async (so) => {
      const song = await ZingMp3.getInfoSong(so.id);
      if (song && song.data) {
        const listArtist = song.data.artists ? song.data.artists : [];
        for (let i = 0; i < listArtist.length; i++) {
          let songid = [];
          setTimeout(async() => {
            const artist = await ZingMp3.getArtist(listArtist[i].alias);
          if (artist && artist.data) {
            console.log(artist.data);

            const songListId = [];
            artist.data.sections[0].items.map((song) => {
              songListId.push(song.encodeId);
            });
            const playListId = [];
            artist.data.sections[1] &&
              artist.data.sections[1].items &&
              artist.data.sections[1].items.map((song) => {
                if (song.textType&&song.textType.endsWith("(EP)"))
                  playListId.push(song.encodeId);
              });
            artist.data.sections[2] &&
              artist.data.sections[2].items &&
              artist.data.sections[2].items.map((song) => {
                playListId.push(song.encodeId);
              });
            let form = {
              infor: {
                id: artist.data.id,
                artistsName: artist.data.name,
                avt: artist.data.thumbnailM,
                alias: artist.data.alias,
                biography: artist.data.biography,
                birthday: artist.data.birthday,
                realName: artist.data.realname,
                totalFollow: artist.data.follow,
                songListId: songListId,
                playListId: playListId,
              },
            };

            await Artist.findOneAndUpdate({ id: form.infor.id }, form.infor, {
              upsert: true,
              new: true,
            });
          }
           },500)
        }

        // await Playlist.updateOne(
        //   { playlistId: id },
        //   {
        //     $set: {
        //       songid: songid,
        //       thumbnail: haha.data.thumbnail,
        //     },
        //   }
        // );
      }
      // if (playlist && playlist.data) {
      //   let songid = [];
      //   for (let i = 0; i < playlist.data.song["items"].length; i++) {
      //     songid.push(playlist.data.song["items"][i]["encodeId"]);
      //     const song = await ZingMp3.getInfoSong(
      //       playlist.data.song["items"][i]["encodeId"]
      //     );
      //     const link = await ZingMp3.getSong(
      //       playlist.data.song["items"][i]["encodeId"]
      //     );
      //     const lyric = await ZingMp3.getLyric(
      //       playlist.data.song["items"][i]["encodeId"]
      //     );
      //     if (song && song.data) {
      //       let artist =
      //         song.data.artists &&
      //         song.data.artists.length > 0 &&
      //         song.data.artists.map((artist) => artist.id);
      //       // console.log(song.data.artists.map(artist => artist.id));
      //       console.log(song.data.genreIds);

      //       let genres =
      //         song.data && song.data.genreIds ? song.data.genreIds : [];
      //       // genres.push("IWZ9Z08C");
      //       // genres.push("IWZ9Z087");
      //       let form = {
      //         infor: {
      //           id: song.data.encodeId,
      //           songname: song.data.title,
      //           thumbnail: song.data.thumbnailM,
      //           alias: song.data.alias,
      //           artists: artist,
      //           genresid: genres,
      //           songLink: link && link.data && link.data["128"],
      //           duration: song.data.duration,
      //           lyric: lyric && lyric.data && lyric.data["sentences"],
      //           like: getRandomNumber(100, 5000),
      //           listen: getRandomNumber(100, 5000),
      //         },
      //       };
      //       if (link && link.data && link.data["128"]) {
      //         let data = await Song.findOneAndUpdate(
      //           { id: form.infor.id },
      //           form.infor,
      //           { upsert: true, new: true }
      //         );
      //       }
      //       // let data = await Playlist.findOneAndUpdate(
      //       //   { playlistId: playlist.data.encodeId },
      //       //   {
      //       //     playlistId: playlist.data.encodeId,
      //       //     playlistname: playlist.data.title,
      //       //     genresid: ["IWZ9Z087","IWZ9Z08C"],
      //       //     thumbnail: playlist.data.thumbnailM,
      //       //     description: playlist.data.sortDescription,
      //       //     songid: songid,
      //       //     type: 'album',
      //       //     artistsId:[playlist.data.artists[0].id]
      //       //   },
      //       //   { upsert: true, new: true }
      //       // );
      //     }
      //   }
      // }
    });

    res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Gặp lỗi khi xoá các document không đúng định dạng." });
  }
};

const getHome = async (req, res) => {
  try {
    const [
      newRelease,
      songHot,
      songChill,
      songTop100,
      albumHot,
      songRating,
      songRemix,
      songSad,
    ] = await Promise.all([
      getNewRelease(),
      getSongHot(),
      getSongChill(),
      getSongTop100(),
      getAlbumHot(),
      getSongRating(),
      getSongRemix(),
      getSongSad(),
    ]);

    const url = {
      items: [
        {
          sectionType: "banner",
          viewType: "slider",
          title: "",
          link: "",
          sectionId: "hSlider",
          items: [
            {
              type: 4,
              link: "/playlist/Hot-Hits-Vietnam/67IZCUUF.html",
              banner:
                "https://photo-zmp3.zmdcdn.me/banner/c/b/a/9/cba97d45bb1364798710382164772c80.jpg",
              cover:
                "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/5/6/3/e/563e9d84f6b05e1753e9c484a4097dfa.jpg",
              target: "1",
              title: "",
              description: "",
              ispr: 0,
              encodeId: "67IZCUUF",
            },
            {
              type: 4,
              link: "/playlist/Today-s-V-Pop-Hits/ZWZCOU98.html",
              banner:
                "https://photo-zmp3.zmdcdn.me/banner/4/2/b/e/42be71b2dcc5eb23b1fb04fd7ad8bf5a.jpg",
              cover:
                "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/5/b/f/a/5bfa668b2773371bbeb73af42a7ff537.jpg",
              target: "1",
              title: "",
              description: "",
              ispr: 0,
              encodeId: "ZWZCOU98",
            },
            {
              type: 4,
              link: "/playlist/US-UK-Gay-Nghien/ZOD8IUEW.html",
              banner:
                "https://photo-zmp3.zmdcdn.me/banner/6/d/6/9/6d693bab998cd7c0296e13d8f33167cf.jpg",
              cover: "https://photo-zmp3.zmdcdn.me/default.jpg",
              target: "1",
              title: "",
              description: "",
              ispr: 0,
              encodeId: "ZOD8IUEW",
            },
          ],
        },
      ],
      hasMore: false,
      total: 20,
    };
    return res.json({
      url,
      newRelease,
      songHot,
      songChill,
      songTop100,
      albumHot,
      songRating,
      songRemix,
      songSad,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  handleHome,
  getHome,
};
