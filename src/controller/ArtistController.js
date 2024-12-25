import {infoArtist,ArtistSong,Artistplaylist} from "../services/artist_service"
const getArtist = async (req, res) => {
  // id là alias
  const artistId = req.params.id;
  const data = await infoArtist(artistId)
  console.log(data);
  
  if (data) {
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT // Sử dụng dữ liệu đã được cập nhật
    });
  } else {
    return res.status(200).json({
      EM: "error111",
      EC: "1",
      DT: "", // Sử dụng dữ liệu đã được cập nhật
    });
  }
};
const getArtistSong = async (req, res) => {
  // id là alias
  const artistId = req.params.id;
  const data = await ArtistSong(artistId)
  if (data) {
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT // Sử dụng dữ liệu đã được cập nhật
    });
  } else {
    return res.status(200).json({
      EM: "error111",
      EC: "1",
      DT: "", // Sử dụng dữ liệu đã được cập nhật
    });
  }
};
const getArtistPlaylist = async (req, res) => {
  // id là alias
  const artistId = req.params.id;
  const data = await Artistplaylist(artistId)
  if (data) {
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT // Sử dụng dữ liệu đã được cập nhật
    });
  } else {
    return res.status(200).json({
      EM: "error111",
      EC: "1",
      DT: "", // Sử dụng dữ liệu đã được cập nhật
    });
  }
};
export { getArtist,getArtistSong,getArtistPlaylist };
