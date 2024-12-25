import { getSongEditPage } from "../../services/adminService/getSong[editPage]"
const getSongEditPage_Controller = async (req, res) => {
    const id = req.params.id;
    const data = await getSongEditPage(id)

    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: data.DT,
        });
    }
    else {
        return res.status(400).json({
            EM: data.EM,
            EC: "-1",
            DT: data.DT,
        });
    }
}
module.exports = {
    getSongEditPage_Controller
}