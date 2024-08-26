import Genres from "../models/genre_model";
import Playlist from "../models/playlist_model";
import Song from "../models/sonng_model";

const getGenres = async () => {
  try {
    const genres = await Genres.find({});
    if (genres.length > 0) {
      const format = await Promise.all(
        genres.map(async (genre) => {
          const playlistIds = await Promise.all(
            genre.playListId.map(async (p) => {
              const playlists = await Playlist.findOne({ playlistId: p });

              return playlists;
            })
          );

          // Lọc bỏ giá trị null từ mảng playlistIds
          const filteredPlaylistIds = playlistIds.filter(
            (playlist) => playlist !== null
          );

          // Kiểm tra xem filteredPlaylistIds không rỗng
          if (filteredPlaylistIds.length > 0) {
            genre.playListId = filteredPlaylistIds;
            return genre;
          } else {
            // Nếu không có playlist nào khác null, trả về null để loại bỏ genre này khỏi mảng format
            return null;
          }
        })
      );
      return {
        EM: "Lấy genres thành công!",
        EC: "0",
        DT: { genres: format }, // Sử dụng dữ liệu đã được cập nhật
      };
    } else {
      return {
        EM: "Không có genres!",
        EC: "1",
        DT: "",
      };
    }
  } catch (error) {
    // Handle error here
    console.error(error);
    return {
      EM: "Đã xảy ra lỗi khi lấy genres!",
      EC: "2",
      DT: "",
    };
  }
};

const getGenresById = async (id) => {
  try {
    const getGenres =async () => {
      const songHot = await Genres.findOne({ genreId: id })
      
      return songHot;
    };
    const getPlaylistHot = async () => {
      const songHot = await Playlist.find({
        state: { $ne: 1 },
        type: "playlist",
        genresid: { $in: [id] },
      })
        .sort({ listen: -1 })
        .limit(5);
      return songHot;
    };
    const getAlbumHot = async () => {
      const songHot = await Playlist.find({
        state: { $ne: 1 },
        type: "album",
        genresid: { $in: [id] },
      })
        .sort({ listen: -1 })
        .limit(5);
      return songHot;
    };
    const getSongHot = async () => {
      const songHot = await Song.find({
        state: { $ne: 1 },
        genresid: { $in: [id] },
      })
        .sort({ listen: -1 })
        .limit(15);
      return songHot;
    };

    const playlists = await getPlaylistHot();
    const albums = await getAlbumHot();
    const songs = await getSongHot();
    const genres = await getGenres();
    console.log(genres);

    if (albums.length > 0) {
      const listArtist = albums.map((item) => item.artistsId[0]);
      const format = await Promise.all(
        listArtist.map(async (p) => {
          const playlists = await Playlist.findOne({ playlistId: p });
          return playlists;
        })
      );

      return {
        EM: "Lấy genres thành công!",
        EC: "0",
        DT: { playlists, songs, albums,genres }, // Sử dụng dữ liệu đã được cập nhật
      };
    } else {
      return {
        EM: "Không có genres!",
        EC: "0",
        DT: { playlists, songs, albums,genres }
      };
    }
  } catch (error) {
    // Xử lý lỗi ở đây
    console.error(error);
    return {
      EM: "Đã xảy ra lỗi khi lấy genres!",
      EC: "2",
      DT: "",
    };
  }
};

module.exports = { getGenres, getGenresById };
