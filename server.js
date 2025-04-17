import app from "./app/app.js";
import { connectDB } from "./app/config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})