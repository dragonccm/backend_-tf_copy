
import { getBan } from "../../services/adminService/getban"
const getbanData = async (req, res) => {
    const getBandata = await getBan()

    if (getBandata.EC == "0") {
        return res.status(200).json({
            EM: getBandata.EM,
            EC: "0",
            DT: getBandata.DT,
        });
    }
}

module.exports = {
    getbanData,
}