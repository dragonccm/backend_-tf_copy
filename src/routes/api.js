import express from "express";
import { checkUserJWT, checkUserPermission } from "../middleware/jwt.js";
const passport = require("passport");

const { search } = require("../controller/getData.js");
import {
  getArtist,
  getArtistSong,
  getArtistPlaylist,
} from "../controller/ArtistController.js";
const {
  getRating,
  addHistoryRank,
} = require("../controller/RatingController.js");
const { getHome } = require("../controller/homeController.js");
const {
  fetchPlaylist,
  getRelatedPlaylist,
} = require("../controller/playlistController.js");
const {
  fetchGenres,
  getGenresbyId,
} = require("../controller/genresController.js");
const { get100 } = require("../controller/getTop100.js");
const {
  fetchclone,
  fetchplaylistclone,
  fetchArtistsClone,
  fetchAutoCloneGenre,
  fetchSongData,
} = require("../controller/clonedata.js");
const { addToHistory, getHistory } = require("../controller/history.js");
const {
  handleRegister,
  handleLogin,
  handleLogingg,
  checkAccount,
  handleLogout,
  handleForgotPassword,
  handleVerifyOtp,
  RequestOTP,
} = require("../controller/Authentication.js");

import {
  Infor,
  editInfor,
  changePass,
  updateBanSongs,
  addLikeSomething,
  unLikeSomething,
  getMyPl,
  getBlocked,
  removeBlocked,
  createMyPl,
  addToPlaylist,
  getAllUs,
  getAlGenre,
  adminHome,
  userGetLikeSongs,
  changeRoleCtrl,
  deleteMyPl,
  resetPass,
} from "../controller/User.js";
const { adminSong } = require("../controller/admin/listStong.js");
const { adminPlaylist } = require("../controller/admin/listPlaylist.js");
const { adminAr } = require("../controller/admin/listSinger.js");
const { adminComment } = require("../controller/admin/listcomment.js");
const { songdetail, songPage } = require("../controller/songController.js");

const { search_Controller } = require("../controller/searchController.js");
const { adminS } = require("../controller/admin/song.js");
const { adminG } = require("../controller/admin/genre.js");
const { adminA } = require("../controller/admin/artists.js");
const { adminP } = require("../controller/admin/playlist.js");
const { bancomment } = require("../controller/admin/comment.js");

const {
  getSongEditPage_Controller,
} = require("../controller/admin/getSongCrtl[editPage].js");

const { getSongRankControl } = require("../controller/rangkingSong.js");
const { getPlaylistRankControl } = require("../controller/rangkingPlaylist.js");

const {
  getSongRankListenControl,
  getRankMothControl
} = require("../controller/rangkingSongListen.js");
const {
  getPlaylistRankListenControl,
} = require("../controller/rangkingPlaylistListen.js");
const {
  restComment,
  getComment,
  editComment,
  createComment,
  deleteComment,
  reportComment,
} = require("../controller/restComment.js");
const { getbanData } = require("../controller/admin/getBan.js");

const {
  searchSongsCtrl,
  searchGenreCtrl,
  searchPlaylistCtrl,
  searchUserCtrl,
  searchArtistsCtrl,
} = require("../controller/admin/adminSearch.js");

const {
  getSlideController,
  setSildeController,
  insertSildeController,
} = require("../controller/admin/getSlideController.js");

const router = express.Router();

const initApiRouter = (app) => {
  router.all("*", checkUserJWT);

  //register
  router.post("/register", handleRegister);
  router.post("/login", handleLogin);
  router.post("/forgot-password", handleForgotPassword);
  router.post("/reset-pass", resetPass);
  router.get("/requestOTP", RequestOTP);

  router.post("/verifyOtp", handleVerifyOtp);
  router.get("/account", checkAccount);
  router.post("/logout", handleLogout);
  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

  router.get(
    "/auth/google/callback",
    (req, res, next) => {
      console.log("kiiiiiiiiiiiiiiiiiiiiiiii");

      passport.authenticate("google", (err, profile, data) => {
        if (err) {
          // Xử lý lỗi
          console.error("Lỗi xác thực Google:", err);
          return res.status(500).send("Lỗi xác thực Google");
        }

        if (!data) {
          // Xử lý trường hợp không tìm thấy người dùng
          console.error("Không tìm thấy người dùng");
          return res.status(401).send("Không tìm thấy người dùng");
        }

        // Lưu thông tin người dùng vào req.user
        req.user = data;
        console.log(data);

        next();
      })(req, res, next);
    },
    (req, res) => {
        res.redirect(
            `http://localhost:3000/login-gg-success/${req.user.token}`
          );
      // handleLogingg(req, res,req.user)
    }
  );
  router.get(
    "/facebook",
    passport.authenticate("facebook", { session: false, scope: ["email"] })
  );

  router.get(
    "/auth/facebook/callback",
    (req, res, next) => {
      passport.authenticate("facebook", (err, profile, data) => {
        console.log("ahhaha", data);
        req.user = data;
        next();
      })(req, res, next);
    },
    (req, res) => {
      res.redirect(`http://localhost:3000/login-gg-success/${req.user.token}`);
      // handleLogingg(req, res,req.user)
    }
  );
  router.post("/login-gg-success", handleLogingg);

  //user
  router.get("/getInfor", Infor);
  router.post("/editInfor", editInfor);
  router.post("/changepass", changePass);
  router.post("/banSong", updateBanSongs);
  router.post("/addlike", addLikeSomething);
  router.post("/unlike", unLikeSomething);
  router.post("/createplaylist", createMyPl);
  router.get("/getuserplaylist", getMyPl);
  router.get("/getBlocked", getBlocked);
  router.post("/removeBlocked", removeBlocked);

  router.post("/getuserlikesong", userGetLikeSongs);
  router.post("/addtoplaylist", addToPlaylist);
  //music
  router.get("/songdetail/:id", songdetail);
  router.get("/songPage/:id", songPage);
  router.get("/search/:id", search);
  router.get("/home", getHome);
  // get rankings (rating)
  router.get("/rating", getRating);
  router.get("/artist/:id", getArtist);
  router.get("/artistSong/:id", getArtistSong);
  router.get("/artistPlaylist/:id", getArtistPlaylist);
  router.get("/get100", get100);
  router.get("/getplaylist/:id", fetchPlaylist);
  router.get("/getRelatedPlaylist/:id", getRelatedPlaylist);
  router.get("/getgenres", fetchGenres);
  router.get("/getGenresbyId/:id", getGenresbyId);
  router.get("/clone", fetchclone);
  router.post("/cloneplaylist", fetchplaylistclone);
  router.post("/clonepArtists", fetchArtistsClone);
  router.get("/getComment/:id/:page", getComment);
  router.post("/createComment", createComment);
  router.post("/editComment", editComment);
  router.post("/deleteComment", deleteComment);
  router.post("/reportComment", reportComment);
  router.post("/delemyplaylist", deleteMyPl);

  router.get("/getrankingservice/:id/:range/:start", getSongRankControl);
  router.post("/getrankingplservice", getPlaylistRankControl);

  router.get(
    "/getrankingservicelisten/:id/:range/:start",
    getSongRankListenControl
  );
  
  router.get(
    "/admin/songRankThisMonth",getRankMothControl
  );
  router.post("/getrankingplservicelisten", getPlaylistRankListenControl);

  // history
  router.post("/addnewhistory", addToHistory);
  router.post("/addRanking", addHistoryRank);
  router.get("/getHistory", getHistory);
  // search page
  router.get("/searchpage/:id", search_Controller);

  // admin
  router.get("/getallsong", fetchAutoCloneGenre);
  router.post("/postsong", fetchSongData);

  router.get("/admin/song/:id", adminSong);
  router.get("/admin/playlist/:id", adminPlaylist);
  router.get("/admin/artist/:id", adminAr);
  router.get("/admin/user/:id", getAllUs);
  router.get("/admin/genres/:id", getAlGenre);
  router.get("/admin/comment/:id", adminComment);
  router.get("/admin/home/", adminHome);

  router.post("/admin/restsong", adminS);
  router.post("/admin/restgenre", adminG);
  router.post("/admin/restartists", adminA);
  router.post("/admin/restplaylist", adminP);
  router.post("/admin/bancomment", bancomment);
  router.post("/admin/restuser", changeRoleCtrl);
  router.get("/admin/getbanData", getbanData);
  // new sear
  router.post("/admin/searchSongs", searchSongsCtrl);
  router.post("/admin/searchGenre", searchGenreCtrl);
  router.post("/admin/searchPlaylist", searchPlaylistCtrl);
  router.post("/admin/searchUser", searchUserCtrl);
  router.post("/admin/searchArtists", searchArtistsCtrl);
  router.get("/admin/getslide", getSlideController);
  router.post("/admin/setslide/:id", setSildeController);
  router.post("/admin/insertslide", insertSildeController);

  router.get("/admin/editpage/:id", getSongEditPage_Controller);

  return app.use("/api", router);
};

export default initApiRouter;
