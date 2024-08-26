import { getTop100 } from "../services/top100-services";

const get100 = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getTop100(); // Gọi hàm getGenres mà không cần id
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
    get100
};