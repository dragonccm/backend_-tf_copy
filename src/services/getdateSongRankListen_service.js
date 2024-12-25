import SongRanking from "../models/songRanking_model";

const getSongRankListen = async (id, range, start) => {
    try {

        if (id === "all") {
            const today = new Date(start);
            today.setHours(0, 0, 0, 0);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - range);

            const songRankings = await SongRanking.aggregate([
                {
                    $match: {
                        rankingDate: {
                            $gte: thirtyDaysAgo,
                            $lte: today,
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$rankingDate" } },
                        listenCount: { $sum: "$listenCount" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        listenCount: { $ifNull: ["$listenCount", 0] },
                    },
                },
                {
                    $sort: { date: 1 },
                },
            ]);

            // Fill in missing dates with zero listenCount
            const startDate = new Date(thirtyDaysAgo);
            const endDate = new Date(today);
            const dateMap = new Map();
            console.log(songRankings);
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toISOString().split('T')[0];
                dateMap.set(formattedDate, 0);
            }
            for (const ranking of songRankings) {
                dateMap.set(ranking.date, ranking.listenCount);
            }
            const completeSongRankings = Array.from(dateMap, ([date, listenCount]) => ({ date, listenCount }));

            return {
                EM: "lấy lượt nghe!",
                EC: "0",
                DT: completeSongRankings,
            };
        } else {
            const today = new Date(start);
            today.setHours(0, 0, 0, 0);
            const tenDaysAgo = new Date(start);
            tenDaysAgo.setDate(tenDaysAgo.getDate() - range);

            const songRankings = await SongRanking.find({
                songId: id,
                rankingDate: {
                    $gte: tenDaysAgo,
                    $lte: today,
                },
            });
            return {
                EM: "Ranking!",
                EC: "0",
                DT: songRankings,
            };
        }
    }
    catch (error) {
      console.log(error);
        return {
            EM: "Lỗi lấy lượt nghe!",
            EC: "1",
            DT: [],
        };
    }
};
const getRankMoth = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const songRankings = await SongRanking.aggregate([
            {
                $match: {
                    rankingDate: {
                        $gte: startOfMonth,
           
                    },
                },
            },
            {
                $group: {
                    _id: "$songId",
                    listenCount: { $sum: "$listenCount" },
                },
            },
            {
                $sort: { listenCount: -1 },
            },
            {
                $limit: 20,
            },
            {
                $lookup: {
                    from: "songs",
                    localField: "_id",
                    foreignField: "id",
                    as: "songDetails",
                },
            },
            {
                $unwind: "$songDetails",
            },
            {
                $project: {
                    _id: 0,
                    songId: "$_id",
                    listenCount: 1,
                    songName: "$songDetails.songname",
                },
            },
        ]);

        return {
            EM: "lấy lượt nghe!",
            EC: "0",
            DT: songRankings,
        };
    } catch (error) {
        return {
            EM: "Lỗi lấy lượt nghe!",
            EC: "1",
            DT: [],
        };
    }
};

module.exports = { getSongRankListen, getRankMoth };
