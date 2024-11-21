import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import * as Sentry from "@sentry/node";

dotenv.config();

const app = express();

// Inisialisasi Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: true,
});

// View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/", userRoutes,);

// connect to Database MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "test",
  })
  .then(() => console.log("Terhubung ke MongoDB"))
  .catch((err) => {
    console.error("Error koneksi MongoDB:", err);
    process.exit(1); // Keluar jika koneksi gagal
  });

app.use((req, res, next) => {
  res.status(404).render("404", { message: "Halaman tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error("Terjadi error:", err);
  res.status(500).json({
    status: "failed",
    message: "Terjadi kesalahan pada server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});