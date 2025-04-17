import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // This middleware allows your Express app to read and parse incoming form data sent via POST requests from HTML forms (like <form method="POST">).
app.use(express.static("public")); // This tells Express to serve static frontend files (HTML, CSS, JS, images) from the public/ folder. You can visit http://localhost:5000/index.html, and it will load directly without needing a special route.

app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

