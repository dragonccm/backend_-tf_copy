import PlaylistRanking from "../models/playlistRanking_model";

const getPlaylistRank = async (id) => {
    if (id === "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const playlistRankings = await PlaylistRanking.aggregate([
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

        const startDate = new Date(thirtyDaysAgo);
        const endDate = new Date(today);
        const dateMap = new Map();
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];
            dateMap.set(formattedDate, 0);
        }
        for (const ranking of playlistRankings) {
            dateMap.set(ranking.date, ranking.likeCount);
        }
        const completePlaylistRankings = Array.from(dateMap, ([date, likeCount]) => ({ date, likeCount }));

        return {
            EM: "thêm vào lịch sử thành công!",
            EC: "0",
            DT: completePlaylistRankings,
        };
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); 

        const playlistRanking = await PlaylistRanking.find({
            playlistId: id,
            rankingDate: {
                $gte: tenDaysAgo, 
                $lte: today,
            },
        });

        return {
            EM: "thêm vào lịch sử thành công!",
            EC: "0",
            DT: playlistRanking,
        };
    }
};

module.exports = { getPlaylistRank };
