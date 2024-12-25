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

    res.status(200).json({ message: "Hello from home controller" });
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
