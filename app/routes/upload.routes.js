import express from "express";
import { uploadMedia, getAllMedia } from "../controllers/upload.controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadMedia);
router.get("/", getAllMedia);

export default router;