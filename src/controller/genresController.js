import { getGenres,getGenresById } from "../services/genres-services";

const fetchGenres = async (_, res) => {
    try {
        const data = await getGenres(); // Gọi hàm getGenres mà không cần id
        return res.status(200).json(data); // Trả về data nhận được từ hàm getGenres
    } catch (error) {
        res.status(500).send(`Failed to get genres: ${error.message}`); // Chỉnh lại mã lỗi thành 500 vì điều này liên quan đến lỗi server
    }
};
const getGenresbyId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getGenresById(id); // Gọi hàm getGenres mà không cần id
        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } else {
            return res.status(200).json({
                EM: "error from server",
                EC: "-1",
                DT: "No update made"
            });
        }
    } catch (error) {
        return res.status(200).json({
            EM: "error from server",
            EC: "-1",
            DT: "Song not found"
        });
    }
};

module.exports = {
    fetchGenres,getGenresbyId
};
