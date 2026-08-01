import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import analyzerRoutes from "./routes/analyzerRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Flexible header policies for cross-origin frontend requests
}));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.CLIENT_URL === "*") {
      callback(null, true);
    } else {
      callback(null, true); // Allow cross-origin preview requests
    }
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect Database
connectDB();

// API Routes
app.use("/api", analyzerRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ResumeFit MERN Backend",
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 ResumeFit Server running on port ${PORT}`);
  console.log(`=================================`);
});

export default app;
