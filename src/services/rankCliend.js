import SongRanking from "../models/songRanking_model";
import Song from "../models/sonng_model";
import Playlist from "../models/playlist_model";

// Hàm tính điểm cho bài hát dựa trên các tiêu chí
const calculateSongScore = (song, rankingDate) => {
  const currentMonth = new Date(rankingDate).getMonth();
  const currentYear = new Date(rankingDate).getFullYear();

  // Tìm dữ liệu xếp hạng của bài hát trong tháng hiện tại
  return SongRanking.aggregate([
    {
      $match: {
        songId: song.id,
        rankingDate: {
          $gte: new Date(currentYear, currentMonth - 1),
          $lt: new Date(currentYear, currentMonth),
        },
      },
    },
    {
      $group: {
        _id: "$songId",
        totalListen: { $sum: "$listenCount" },
        totalLike: { $sum: "$likeCount" },
      },
    },
  ]).then((result) => {
    if (result.length > 0) {
      const { totalListen, totalLike } = result[0];
      // Trọng số cho mỗi tiêu chí (có thể thay đổi)
      const listenWeight = 1;
      const likeWeight = 0.5;
      return totalListen * listenWeight + totalLike * likeWeight;
    } else {
      return 0;
    }
  });
};

// Hàm so sánh thứ hạng với tháng trước
const compareRankingWithPreviousMonth = async (songId, rankingDate) => {
  const currentMonth = new Date(rankingDate).getMonth();
  const currentYear = new Date(rankingDate).getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Tìm dữ liệu xếp hạng của bài hát trong tháng hiện tại và tháng trước
  const currentMonthRanking = await SongRanking.aggregate([
    {
      $match: {
        songId: songId,
        rankingDate: {
          $gte: new Date(currentYear, currentMonth),
          $lt: new Date(currentYear, currentMonth + 1),
        },
      },
    },
    {
      $group: {
        _id: "$songId",
        rank: { $min: "$rank" },
      },
    },
  ]);

  const previousMonthRanking = await SongRanking.aggregate([
    {
      $match: {
        songId: songId,
        rankingDate: {
          $gte: new Date(previousYear, previousMonth),
          $lt: new Date(previousYear, previousMonth + 1),
        },
      },
    },
    {
      $group: {
        _id: "$songId",
        rank: { $min: "$rank" },
      },
    },
  ]);

  if (currentMonthRanking.length > 0 && previousMonthRanking.length > 0) {
    const currentRank = currentMonthRanking[0].rank;
    const previousRank = previousMonthRanking[0].rank;

    if (currentRank < previousRank) {
      return "Lên hạng";
    } else if (currentRank > previousRank) {
      return "Xuống hạng";
    } else {
      return "Giữ hạng";
    }
  } else {
    return "Không có dữ liệu so sánh";
  }
};

// Hàm tạo playlist bảng xếp hạng tháng
const createMonthlyRankingPlaylist = async (rankingDate) => {
  const currentMonth = new Date(rankingDate).getMonth();
  const currentYear = new Date(rankingDate).getFullYear();
  const playlistName = `Bảng xếp hạng tháng ${currentMonth + 1}/${currentYear}`;

  // Lấy 100 bài hát có điểm cao nhất
  const topSongs = await Song.find({})
    .select("artists id songname thumbnail duration")
    .sort({ state: 1 })
    .limit(100)
    .then((songs) => {
      return songs.map((song) => {
        return calculateSongScore(song, rankingDate).then((score) => {
          return {
            songId: song.id,
            score: score,
          };
        });
      });
    });

  // Sắp xếp bài hát theo điểm
  const sortedTopSongs = await Promise.all(topSongs).then((songs) =>
    songs.sort((a, b) => b.score - a.score)
  );
  function generatePlaylistId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Chuỗi chứa chữ cái và số
    let playlistId = "";
    for (let i = 0; i < 8; i++) {
      playlistId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return playlistId;
  }

  const playlistId = generatePlaylistId();
  // Tạo playlist
  const playlist = await Playlist.create({
    playlistId: playlistId,
    playlistname: playlistName,
    genresid: [],
    artistsId: [],
    thumbnail: "",
    type: "Monthly Ranking",
    description: "Bảng xếp hạng các bài hát phổ biến nhất trong tháng",
    songid: sortedTopSongs.map((song) => song.songId),
    like: 0,
    listen: 0,
    state: 0,
  });

  // Cập nhật thứ hạng cho mỗi bài hát
  for (let i = 0; i < sortedTopSongs.length; i++) {
    const songId = sortedTopSongs[i].songId;
    const rank = i + 1;

    // Tạo dữ liệu xếp hạng cho bài hát
    const ranking = await SongRanking.findOneAndUpdate(
      { songId: songId, rankingDate: rankingDate },
      {
        rank: rank,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // So sánh thứ hạng với tháng trước
    const rankComparison = await compareRankingWithPreviousMonth(
      songId,
      rankingDate
    );
    // console.log(`Bài hát ${songId}: Thứ hạng ${rank} - ${rankComparison}`);
  }

  console.log(`Playlist ${playlistName} đã được tạo thành công!`);
};

// Chạy hàm createMonthlyRankingPlaylist vào đầu mỗi tháng
const runMonthlyRanking = async () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  await createMonthlyRankingPlaylist(firstDayOfMonth);
};

// Hàm so sánh thứ hạng với tuần trước
const compareRankingWithPreviousWeek = async (songId, rankingDate, genreId) => {
  const currentWeek = getWeekNumber(rankingDate);
  const currentYear = new Date(rankingDate).getFullYear();
  const previousWeek = currentWeek === 1 ? 52 : currentWeek - 1;
  const previousYear = currentWeek === 1 ? currentYear - 1 : currentYear;

  // Tìm dữ liệu xếp hạng của bài hát trong tuần hiện tại và tuần trước
  const currentWeekRanking = await SongRanking.aggregate([
    {
      $match: {
        songId: songId,
        genreId: genreId,
        rankingDate: {
          $gte: getMondayOfWeek(currentYear, currentWeek),
          $lt: getMondayOfWeek(currentYear, currentWeek + 1),
        },
      },
    },
    {
      $group: {
        _id: "$songId",
        rank: { $min: "$rankWeek" },
      },
    },
  ]);

  const previousWeekRanking = await SongRanking.aggregate([
    {
      $match: {
        songId: songId,
        genreId: genreId,
        rankingDate: {
          $gte: getMondayOfWeek(previousYear, previousWeek),
          $lt: getMondayOfWeek(previousYear, previousWeek + 1),
        },
      },
    },
    {
      $group: {
        _id: "$songId",
        rank: { $min: "$rankWeek" },
      },
    },
  ]);

  if (currentWeekRanking.length > 0 && previousWeekRanking.length > 0) {
    const currentRank = currentWeekRanking[0].rank;
    const previousRank = previousWeekRanking[0].rank;

    if (currentRank < previousRank) {
      return "Lên hạng";
    } else if (currentRank > previousRank) {
      return "Xuống hạng";
    } else {
      return "Giữ hạng";
    }
  } else {
    return "Không có dữ liệu so sánh";
  }
};
const genresMap = {
  week_vn: "IWZ9Z087",
  week_us: "IWZ9Z086",
  week_korea: "IWZ9Z08U",
};
const createWeeklyRankingPlaylist = async (rankingDate, genreId) => {
  const currentWeek = getWeekNumber(rankingDate);
  const currentYear = new Date(rankingDate).getFullYear();
  const playlistName = `Bảng xếp hạng tuần ${currentWeek}/${currentYear} - ${genresMap[genreId]}`;

  // Lấy 100 bài hát có điểm cao nhất trong thể loại
  const topSongs = await Song.find({ genresid: genresMap[genreId] })
    .select("artists id songname thumbnail duration")
    .sort({ state: 1 })
    .limit(50)
    .then((songs) => {
      return songs.map((song) => {
        return calculateSongScore(song, rankingDate).then((score) => {
          return {
            songId: song.id,
            score: score,
          };
        });
      });
    });

  // Sắp xếp bài hát theo điểm
  const sortedTopSongs = await Promise.all(topSongs).then((songs) =>
    songs.sort((a, b) => b.score - a.score)
  );

  // Tạo playlist
  function generatePlaylistId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Chuỗi chứa chữ cái và số
    let playlistId = "";
    for (let i = 0; i < 8; i++) {
      playlistId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return playlistId;
  }

  const playlistId = generatePlaylistId();
  const playlist = await Playlist.create({
    playlistname: playlistName,
    playlistId: playlistId,
    genresid: [genresMap[genreId]],
    artistsId: [],
    thumbnail: "",
    type: "Weekly Ranking",
    description: "Bảng xếp hạng các bài hát phổ biến nhất trong tuần",
    songid: sortedTopSongs.map((song) => song.songId),
    like: 0,
    listen: 0,
    state: 0,
  });

  // Cập nhật thứ hạng cho mỗi bài hát
  for (let i = 0; i < sortedTopSongs.length; i++) {
    const songId = sortedTopSongs[i].songId;
    const rank = i + 1;

    // Tạo dữ liệu xếp hạng cho bài hát
    const ranking = await SongRanking.findOneAndUpdate(
      { songId: songId, rankingDate: rankingDate },
      {
        rankWeek: rank,
      },
      {
        upsert: true,
        new: true,
      }
    );
    const previousWeekRankingDate = new Date(rankingDate);
    previousWeekRankingDate.setDate(previousWeekRankingDate.getDate() - 7); // Tính ngày của tuần trước

    const randomRank = Math.floor(Math.random() * 50) + 1; // Rank ngẫu nhiên từ 1-50

    const previousWeekRanking = await SongRanking.findOneAndUpdate(
      { songId: songId, rankingDate: previousWeekRankingDate },
      {
        rankWeek: randomRank,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // So sánh thứ hạng với tuần trước
    const rankComparison = await compareRankingWithPreviousWeek(
      songId,
      rankingDate,
      genreId
    );
    console.log(
      `Bài hát ${songId}: Thứ hạng ${rank} - ${rankComparison} - ${genresMap[genreId]}`
    );
  }

  console.log(`Playlist ${playlistName} đã được tạo thành công!`);
};

// Hàm lấy thứ tự tuần trong năm
const getWeekNumber = (date) => {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const today = new Date(date);

  const diff = today - onejan;
  const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  const week = Math.ceil(day / 7);

  return week;
};

// Hàm lấy ngày thứ hai của tuần
const getMondayOfWeek = (year, week) => {
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(monday.getDate() - day + 1);

  return monday;
};

// Chạy hàm tạo playlist xếp hạng tuần cho mỗi thể loại
const runWeeklyRanking = async () => {
  const now = new Date();
  const mondayOfWeek = getMondayOfWeek(now.getFullYear(), getWeekNumber(now));

  for (const genreId in genresMap) {
    await createWeeklyRankingPlaylist(mondayOfWeek, genreId);
  }
};
function sortSongsBySongId(songid, songs) {
  const songMap = {};
  songs.forEach((song) => {
    songMap[song.id] = song;
  });

  const sortedSongs = songid.map((id) => songMap[id]);

  return sortedSongs;
}
const getPlaylistRankMonth = async () => {
  const now = new Date();
  const rankingDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonth = rankingDate.getMonth();
  const currentYear = rankingDate.getFullYear();

  const playlistFilter = {
    playlistname: `Bảng xếp hạng tháng ${currentMonth + 1}/${currentYear}`,
    state: { $ne: 1 },
  };
  let playlistNames = `Bảng xếp hạng tháng ${currentMonth}/${currentYear}`;
  let playlist = await Playlist.aggregate([
    { $match: playlistFilter },
    {
      $lookup: {
        from: "songs",
        let: { song_ids: "$songid" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$id", "$$song_ids"] },
            },
          },
          { $sort: { id: 1 } },
          {
            $lookup: { // Thêm stage lookup cho artist
              from: "artists",
              localField: "artists",
              foreignField: "id",
              as: "artist_info",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              songname: 1,
              artists: { $ifNull: ["$artist_info", []] },
              thumbnail: 1,
              duration: 1,
            },
          },
        ],
        as: "songs",
      },
    },
  ]);
  
  if (playlist.length === 0) {
    console.log('Không có playlist');
    
    playlist = await Playlist.aggregate([
      {
        $match: {
          playlistname: `Bảng xếp hạng tháng 9/${currentYear}`,
          state: { $ne: 1 },
        },
      },
      {
        $lookup: {
          from: "songs",
          let: { song_ids: "$songid" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$id", "$$song_ids"] },
              },
            },
            { $sort: { id: 1 } },
            {
              $lookup: { // Thêm stage lookup cho artist
                from: "artists",
                localField: "artists",
                foreignField: "id",
                as: "artist_info",
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                songname: 1,
                artists: { $ifNull: ["$artist_info", []] },
                thumbnail: 1,
                duration: 1,
              },
            },
          ],
          as: "songs",
        },
      },
    ]);


    playlistNames = `Bảng xếp hạng tháng 8/${currentYear}`;
  }
  
  
  const playlists = await Playlist.findOne(
    { playlistname: playlistNames },
    { songid: 1, _id: 0 }
  );
  

  const song = sortSongsBySongId(playlist[0].songid, playlist[0].songs);
const newData = {...playlist[0],songs: song}
  return {
    EM: "Lấy dữ liệu thành công!",
    EC: "0",
    DT: { NowPlaylist:newData, lastPlaylist :playlists },
  };
};

const getPlaylistRankWeek = async () => {
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const currentYear = now.getFullYear();

  const playlists = [];

  for (const genreId in genresMap) {
    const playlistName = `Bảng xếp hạng tuần ${currentWeek}/${currentYear} - ${genresMap[genreId]}`;
    let playlist = await Playlist.aggregate([
      {
        $match: {
          playlistname: playlistName,
          state: { $ne: 1 },
        },
      },
      {
        $lookup: {
          from: "songs",
          let: { song_ids: "$songid" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$id", "$$song_ids"] },
              },
            },
            { $sort: { id: 1 } },
            {
              $lookup: { // Thêm stage lookup cho artist
                from: "artists",
                localField: "artists",
                foreignField: "id",
                as: "artist_info",
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                songname: 1,
                artists: { $ifNull: ["$artist_info", []] },
                thumbnail: 1,
                duration: 1,
              },
            },
          ],
          as: "songs",
        },
      },
    ]);


    if (!playlist.length > 0) {
      playlist = await Playlist.aggregate([
        {
          $match: {
            playlistname: `Bảng xếp hạng tuần 38/${currentYear} - ${genresMap[genreId]}`,
            state: { $ne: 1 },
          },
        },
        {
          $lookup: {
            from: "songs",
            let: { song_ids: "$songid" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$id", "$$song_ids"] },
                },
              },
              { $sort: { id: 1 } },
              {
                $lookup: { // Thêm stage lookup cho artist
                  from: "artists",
                  localField: "artists",
                  foreignField: "id",
                  as: "artist_info",
                },
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  songname: 1,
                  artists: { $ifNull: ["$artist_info", []] },
                  thumbnail: 1,
                  duration: 1,
                },
              },
            ],
            as: "songs",
          },
        },
      ]);
      // console.log(
      //   `Bảng xếp hạng tuần 37/${currentYear} - ${genresMap[genreId]}`
      // );

      
    } else {
      console.log("No playlist found for:", playlistName);
    }
    const song = sortSongsBySongId(
      playlist[0].songid,
      playlist[0].songs
    );
    const newData = {...playlist[0],songs: song}
    const Lastplaylist = await Playlist.findOne(
      { playlistname: `Bảng xếp hạng tuần 37/${currentYear} - ${genresMap[genreId]}` },
      { songid: 1, _id: 0 }
    );
    playlists.push({ NowPlaylist:newData, lastPlaylist: Lastplaylist });
  }

  return {
    EM: "thêm vào lịch sử ",
    EC: "0",
    DT: playlists,
  };
};

// Hàm lấy thứ tự tuần trong năm

const addRanking = async (id) => {
  let songRanking = await SongRanking.findOne({ songId: id }).sort({
    rankingDate: -1,
  });
  if (songRanking) {
    if (songRanking.rankingDate.getDate() === new Date().getDate()) {
      songRanking.listenCount += 1;
      await songRanking.save();
    } else {
      console.log(
        "sai time",
        songRanking.rankingDate,
        "aaa",
        new Date().getDate()
      );
      const newRanking = new SongRanking({
        songId: songRanking.songId,
        listenCount: 1,
        rankingDate: new Date(),
      });
      await newRanking.save();
    }
  } else {
    const newRanking = new SongRanking({
      songId: id,
      listenCount: 1,
      rankingDate: new Date(),
    });
    await newRanking.save();
  }
  return {
    EM: "Thêm vào lịch sử thành công!",
    EC: "0",
    DT: [],
  };
};

// Giả sử getSongRankingsByGenre và getSongDetails là các hàm đã được định nghĩa để lấy ranking và thông tin chi tiết của bài hát

module.exports = {
  getPlaylistRankMonth,
  getPlaylistRankWeek,
  addRanking,
  runMonthlyRanking,
};
