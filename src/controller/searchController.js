import {SearchPage_service} from "../services/searchPage_service"
const search_Controller = async (req, res) => {
    const keyword = req.params.id;
    const data = await SearchPage_service(keyword)

    if (data.EC == "0") {
        return res.status(200).json({
            EM: data.EM,
            EC: "0",
            DT: data.DT,
          });
    }
}
module.exports = {
    search_Controller
}