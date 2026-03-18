import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import reviewRoutes from "./routes/review.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "https://devlens-five.vercel.app"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);

app.get("/", (req, res) => res.json({ message: "DevLens API running" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
