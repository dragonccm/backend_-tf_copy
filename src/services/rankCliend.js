import SongRanking from "../models/songRanking_model";
import Song from "../models/sonng_model";

const getPlaylistRankMonth = async () => {
  const dateToday = new Date(); // Ngày hiện tại
  const firstDayOfMonth = new Date(
    dateToday.getFullYear(),
    dateToday.getMonth() - 1,
    1
  ); // Ngày đầu tiên của tháng
  console.log(firstDayOfMonth);
  // Tìm ngày gần nhất trước ngày đầu tiên của tháng mà có dữ liệu
  let closestDateWithData = await SongRanking.findOne({
    rankingDate: { $gte: firstDayOfMonth },
  })
    .sort({ rankingDate: -1 })
    .limit(1);
  console.log("1", closestDateWithData);
  if (!closestDateWithData) {
    console.log("Không có dữ liệu gần nhất cho tháng này.");
    return {
      EM: "Không có dữ liệu gần nhất cho tháng này.",
      EC: "1",
      DT: [],
    };
  }

  // Lấy danh sách xếp hạng bài hát
  const songRankings = await SongRanking.aggregate([
    {
      $match: {
        $or: [
          {
            rankingDate: {
              $gte: closestDateWithData.rankingDate,
              $lte: dateToday,
            },
          },
          { rankingDate: { $lt: closestDateWithData.rankingDate } },
        ],
      },
    },
    {
      $group: {
        _id: { songId: "$songId" },
        totalListenCount: { $sum: "$listenCount" },
      },
    },
    {
      $sort: { totalListenCount: -1, "_id.songId": 1 }, // Sắp xếp theo lượt nghe giảm dần
    },
    {
      $lookup: {
        from: "songs",
        localField: "_id.songId",
        foreignField: "id",
        as: "songInfo",
      },
    },
    { $unwind: "$songInfo" },
    {
      $limit: 10, // Giới hạn kết quả trả về 10 bản ghi
    },
  ]);

  if (!songRankings.length) {
    return {
      EM: "Không có bài hát nào trong bảng xếp hạng.",
      EC: "1",
      DT: [],
    };
  }

  const items = songRankings.map((ranking) => {
    return { ...ranking.songInfo };
  });

  return {
    EM: "Thêm vào lịch sử thành công!",
    EC: "0",
    DT: { items },
  };
};

const getPlaylistRankWeek = async () => {
  const genresMap = {
    week_vn: "IWZ9Z087",
    week_us: "IWZ9Z086",
    week_korea: "IWZ9Z08U",
  };

  const dateToday = new Date(); // Ngày hiện tại
  const firstDayOfWeek = new Date(dateToday);
  const dayOfWeek = firstDayOfWeek.getDay();
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOfWeek);
console.log('cc',firstDayOfWeek);
  // Tìm ngày gần nhất trước ngày đầu tiên của tuần mà có dữ liệu
  let closestDateWithData = await SongRanking.findOne({
    rankingDate: { $gte: firstDayOfWeek },
  })
    .sort({ rankingDate: -1 })
    .limit(1);
  console.log('2',closestDateWithData);
  if (!closestDateWithData) {
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7);
    closestDateWithData = await SongRanking.findOne({
      rankingDate: { $gte: firstDayOfWeek },
    })
      .sort({ rankingDate: -1 })
      .limit(1);
  }

  // Lấy danh sách xếp hạng bài hát
  const songRankings = await SongRanking.aggregate([
    {
      $match: {
        $or: [
          {
            rankingDate: {
              $gte: closestDateWithData.rankingDate,
              $lte: dateToday,
            },
          },
          { rankingDate: { $lt: closestDateWithData.rankingDate } },
        ],
      },
    },
    {
      $group: {
        _id: { songId: "$songId" },
        totalListenCount: { $sum: "$listenCount" },
      },
    },
    {
      $sort: { totalListenCount: -1, "_id.songId": 1 }, // Sắp xếp theo lượt nghe giảm dần
    },
  ]);

  if (!songRankings.length) {
    return {
      EM: "Không có bài hát nào trong bảng xếp hạng.",
      EC: "1",
      DT: [],
    };
  }

  // Lấy thông tin bài hát
  const getSongsByGenre = async (genreId) => {
    try {
      const songItems = await Song.find({
        state: { $ne: 1 },
        genresid: genreId,
      }).lean(); // Sử dụng lean() để trả về plain JavaScript object thay vì Mongoose document

      return songItems;
    } catch (error) {
      console.log(`Error retrieving songs for genre ${genreId}:`, error);
      return [];
    }
  };

  const getAllSongsByGenres = async () => {
    const results = await Promise.all(
      Object.entries(genresMap).map(async ([genreKey, genreId]) => {
        const songs = await getSongsByGenre(genreId);
        return { items: songs };
      })
    );

    // Kết hợp mảng các đối tượng thành một đối tượng duy nhất
    return results;
  };

  // Gọi hàm và xử lý kết quả
  const songsByGenres = await getAllSongsByGenres();
  console.log(songsByGenres);
  return {
    EM: "Thêm vào lịch sử thành công!",
    EC: "0",
    DT: songsByGenres,
  };
};
const addRanking = async (id) => {
  let songRanking = await SongRanking.findOne({ songId: id }).sort({ rankingDate: -1 });
  console.log(songRanking);
    if (songRanking) {
      if (songRanking.rankingDate.getDate() === new Date().getDate()) {
        songRanking.listenCount += 1;
        await songRanking.save();
      } else {
        console.log('sai time',songRanking.rankingDate,'aaa',new Date().getDate());
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

module.exports = { getPlaylistRankMonth, getPlaylistRankWeek,addRanking };
