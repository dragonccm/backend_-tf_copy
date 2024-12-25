import PlaylistRanking from "../models/playlistRanking_model";

const getPlaylistRank = async (idata) => {
    const id = idata.id;
    const startDate = idata.startDate;
    const days = idata.days;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() - days + 1); // Go backwards for the specified number of days

    if (id === "all") {
        const playlistRankings = await PlaylistRanking.aggregate([
            {
                $match: {
                    rankingDate: {
                        $gte: end,
                        $lte: start, // Use $lte to include the start date
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

        const dateMap = new Map();
        for (let date = new Date(end); date <= start; date.setDate(date.getDate() + 1)) {
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
        const playlistRanking = await PlaylistRanking.find({
            playlistId: id,
            rankingDate: {
                $gte: end,
                $lte: start, // Use $lte to include the start date
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
