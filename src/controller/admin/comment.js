const Comment = require('../../models/comment_model');

const bancomment = async (req, res) => {
    const { id } = req.body;
    try {
        const comment = await Comment.findOne({ _id: id });
        if (!comment) {
            return res.status(200).json({ error: 'Comment not found' });
        }
        const ban = comment.state;
        const newBan = ban === 1 ? 0 : 1;
        await Comment.updateOne({ _id: id }, { state: newBan });
        return res.status(200).json({
            EM: "đã cập nhật trạng thái",
            EC: "0",
            DT: "",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(200).json({
            EM: err.message || "Lỗi không xác định",
            EC: "-1",
            DT: "",
        });
    }
}

module.exports = {
    bancomment
};  