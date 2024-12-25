import { getSlide, setSilde, insertSilde } from '../../services/adminService/getSlide.js';
import Slide from "../../models/slide_model";
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "drupmc7qd",
    api_key: "725439635389318",
    api_secret: "c52-kr9-K0JKIQVNLQNZnSD5FRs",
});
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
}).single("file");

const getSlideController = async (req, res) => {
    try {
        const data = await getSlide();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const setSildeController = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            try {
                const file = req.file;
                if (!file) {
                    const slide = {
                        slideName: data.slideName,
                        slideDescription: data.slideDescription,
                        playlistId: data.playlistId.split(','), // Convert to array
                    };
                    try {
                        const updateResult = await setSilde(slideId, slide);
                        return res.status(200).json(updateResult);
                    } catch (error) {
                        return res.status(400).json({ error: error.message });
                    }
                }
                const data = req.body;
                const slideId = req.params.id;

                const uploadStream = cloudinary.uploader.upload_stream({ 
                    folder: "slide", 
                    public_id: slideId 
                }, async (error, result) => {
                    if (error) {
                        return res.status(400).json({ error: error.message });
                    }
                    const slide = {
                        slideName: data.slideName,
                        slideImage: result.url,
                        slideDescription: data.slideDescription,
                        playlistId: data.playlistId.split(','), // Convert to array
                    };
                    try {
                        const updateResult = await setSilde(slideId, slide);
                        return res.status(200).json(updateResult);
                    } catch (error) {
                        return res.status(400).json({ error: error.message });
                    }
                });

                uploadStream.end(file.buffer);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const insertSildeController = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            try {
                const file = req.file;
                if (!file) {
                    return res.status(400).json({ error: "No file uploaded" });
                }
                const data = req.body;
                const slideId = uuidv4();
                const slideName = data.slideName;
                const slideDescription = data.slideDescription;
                const playlistId = data.playlistId.split(','); // Convert to array

                const uploadStream = cloudinary.uploader.upload_stream({ 
                    folder: "slide", 
                    public_id: slideId 
                }, async (error, result) => {
                    if (error) {
                        return res.status(400).json({ error: error.message });
                    }
                    const slide = {
                        slideId: slideId,
                        slideName: slideName,
                        slideImage: result.url,
                        slideDescription: slideDescription,
                        playlistId: playlistId,
                    };
                    try {
                        const insertResult = await insertSilde(slide);
                        return res.status(200).json(insertResult);
                    } catch (error) {
                        return res.status(400).json({ error: error.message });
                    }
                });

                uploadStream.end(file.buffer);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { getSlideController, setSildeController, insertSildeController };
