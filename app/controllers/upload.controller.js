import { cloudinary } from "../config/cloudinary.js";
import { Media } from "../models/media.model.js";
import { success, error } from "../utils/apiResponse.js";

export const uploadMedia = async (req, res) => {
    try {
        const file = req.file;

        if(!file) return error(res, "No file uploaded", 400);

        //  (accept raw file data(buffer)->upload it to cloudinary using upload_stream->returns the result(secure_url,public_id))

        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                    resource_type: "auto", // auto detects image/video/pdf
                    folder: "media_uploads", // folder on cloudinary
                },
                (error, result) => {
                    if(result) resolve(result);
                    else reject(error);
                }
            );

                stream.end(fileBuffer); // pushes the buffer to the Cloudinary stream and starts the upload.
            });
        };

        const result = await streamUpload(file.buffer); //  This waits for Cloudinary to finish upload and gives back result like:

        // save to mongodb
        const media = await Media.create({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
        });

        success(res, "upload successful", media);
    } catch (err) {
        console.error("upload error:", err);
        error(res, err.message || "Something went wrong");
    }
};


// get all uploaded media
export const getAllMedia = async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        success(res, "Fetched successfully", media);
    } catch (err) {
        error(res, err.message || "Error fetching media");
    }
}

// delete media
export const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findById(id);
        if(!media) return error(res, "Media not found");

        // delete from cloudinary
        await cloudinary.uploader.destroy(media.public_id, {
            resource_type: media.resource_type === "video" ? "video" : "image"
        });

        // delete from mongodb
        await Media.findByIdAndDelete(id);

        success(res, "Media deleted successfully");
    } catch (err) {
        console.error("Delete error", err);
        error(res, err.message || "Error deleting media");
    }
};







/*
const result = await streamUpload(file.buffer);
// 1. Call streamUpload and pass the file buffer (raw data).
// 2. streamUpload starts uploading the file to Cloudinary.

// Inside streamUpload:
const stream = cloudinary.uploader.upload_stream(... );
stream.end(file.buffer);  // This sends the file buffer to Cloudinary!
// 3. The file buffer is pushed to Cloudinary for uploading.
*/


/*
Basic skelton of cloudinary to upload files and store their info:

const file = req.file;
if (!file) return res.status(400).json({ success: false, message: "No file" });

const result = await cloudinary.uploader.upload_stream(...);
const media = await Media.create({
    url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
});
res.status(200).json({ success: true, data: media });
*/
