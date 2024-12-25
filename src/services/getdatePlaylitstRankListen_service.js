import PlaylistRankingListen from "../models/playlistRanking_model";

const getPlaylistRankListen = async (idata) => {
    const id = idata.id;
    const startDate = idata.startDate;
    const days = idata.days;

    const start = new Date(startDate);
    if (isNaN(start)) {
        return {
            EM: "Invalid start date",
            EC: "1",
            DT: [],
        };
    }
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() - days + 1); // Go backwards for the specified number of days

    if (id === "all") {
        const playlistRankings = await PlaylistRankingListen.aggregate([
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

        const dateMap = new Map();
        for (let date = new Date(end); date <= start; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];
            dateMap.set(formattedDate, 0);
        }
        for (const ranking of playlistRankings) {
            dateMap.set(ranking.date, ranking.listenCount);
        }
        const completePlaylistRankings = Array.from(dateMap, ([date, listenCount]) => ({ date, listenCount }));

        return {
            EM: "thêm vào lịch sử thành công!",
            EC: "0",
            DT: completePlaylistRankings,
        };
    } else {
        const playlistRanking = await PlaylistRankingListen.find({
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

module.exports = { getPlaylistRankListen };
