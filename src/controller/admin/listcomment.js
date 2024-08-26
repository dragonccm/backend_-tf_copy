const Comment = require('../../models/comment_model');
const Song = require('../../models/sonng_model'); // Sửa "sonng_model" thành "song_model"

const adminComment = async (req, res) => {
    const limit = parseInt(req.params.id); // Chuyển đổi limit sang kiểu number
    try {
        // Truy vấn dữ liệu bài hát sau khi xóa trùng lặp
        const commentCount = await Comment.countDocuments({});
        const commentdata = await Comment.find({}, {
            songId: 1,
            content: 1,
            userId: 1,
            createdAt: 1,
            ban: 1,
            reportCount: 1,
            state: 1,
            _id: 1
        }).sort({ _id: -1 }).skip(limit).limit(10);

        const handledata = await Promise.all(commentdata.map(async (comment) => {
            const songName = await Song.findOne({ id: comment.songId }, { songname: 1, _id: 0 });
            comment.songId = songName ? songName.songname : "không tìm thấy bài hát"; 
            return comment;
        }));
        const responseData = { handledata, maxPage: commentCount }; 
        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    adminComment
};