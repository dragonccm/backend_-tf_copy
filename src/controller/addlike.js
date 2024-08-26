import User from "../models/user_model.js";


const addlike = async (req, res) => {
    try {
        if (req.body.data.type === "playlist") {
            const playListData = req.body.data;

            const getUser = await User.findOne({ username: playListData.user });

            if (getUser) {
                if (getUser.likedPlayLists.includes(playListData.id)) {
                    console.log("Id đã tồn tại trong likedPlayLists");
                } else {
                    getUser.likedPlayLists.push(playListData.id);
                    await getUser.save().then((response) => console.log('Dữ liệu đã được thêm vào likedPlayLists:', response.username))
                }
            } else {
                return res.status(200).send({ error: 'User not found' });
            }
        } else {
            const playListData = req.body.data;
            const getUser = await User.findOne({ username: playListData.user });

            if (getUser) {
                if (getUser.likedSongs.includes(playListData.id)) {
                    console.log("Id đã tồn tại trong likedSongs");
                } else {
                    getUser.likedSongs.push(playListData.id);
                    await getUser.save().then((response) => console.log('Dữ liệu đã được thêm vào likedSongs:', response.username))
                }
            } else {
                return res.status(200).send({ error: 'User not found' });
            }
        }
    } catch (err) {
        return res.status(200).send({ error: err.message });
    }
}

export default addlike;
