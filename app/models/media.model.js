import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    resource_type: String
}, {timestamps: true}
);

export const Media = mongoose.model("Media", mediaSchema);