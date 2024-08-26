import SongRanking from "../models/songRanking_model";

const getSongRankListen = async (id) => {
    if (id === "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];
            dateMap.set(formattedDate, 0);
        }
        for (const ranking of songRankings) {
            dateMap.set(ranking.date, ranking.listenCount);
        }
        const completeSongRankings = Array.from(dateMap, ([date, listenCount]) => ({ date, listenCount }));

        return {
            EM: "thêm vào lịch sử thành công!",
            EC: "0",
            DT: completeSongRankings,
        };
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 5);

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
};



module.exports = { getSongRankListen };
