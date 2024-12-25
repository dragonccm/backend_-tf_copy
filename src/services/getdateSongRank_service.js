import SongRanking from "../models/songRanking_model";

const getSongRank = async (id, range, startDay) => {
    try {
        if (id === "all") {
            const today = new Date(startDay);
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
                        likeCount: { $sum: "$likeCount" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        likeCount: { $ifNull: ["$likeCount", 0] },
                    },
                },
                {
                    $sort: { date: 1 },
                },
            ]);

            // Fill in missing dates with zero likeCount
            const startDate = new Date(thirtyDaysAgo);
            const endDate = new Date(today);
            const dateMap = new Map();
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toISOString().split('T')[0];
                dateMap.set(formattedDate, 0);
            }
            for (const ranking of songRankings) {
                dateMap.set(ranking.date, ranking.likeCount);
            }
            const completeSongRankings = Array.from(dateMap, ([date, likeCount]) => ({ date, likeCount }));

            return {
                EM: "lấy luọt like",
                EC: "0",
                DT: completeSongRankings,
            };
        } else {
            const today = new Date(startDay);
            today.setHours(0, 0, 0, 0);
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(tenDaysAgo.getDate() - Number(range));

            const songRankings = await SongRanking.find({
                songId: id,
                rankingDate: {
                    $gte: tenDaysAgo,
                    $lte: today,
                },
            });
            return {
                EM: "lấy luọt like",
                EC: "0",
                DT: songRankings,
            };
        }
    } catch (error) {
        return {
            EM: "Đã xảy ra lỗi!",
            EC: "1",
            DT: error.message,
        };
    }
};

module.exports = { getSongRank };
