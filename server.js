require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const statsRoutes = require("./routes/statsRoutes");
// const statsRoutes = require("./routes/statsRoutes");

// app.use("/api/stats", statsRoutes);
const app = express();

// Middleware
app.use(cors());

// ✅ FIXED HERE
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Desktop folder
const desktopDir = path.join(os.homedir(), "Desktop", "MedcodeUploads");

if (!fs.existsSync(desktopDir)) {
  fs.mkdirSync(desktopDir, { recursive: true });
}

// Static Folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/avatars", express.static(desktopDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", require("./routes/inquiryRoutes"));
app.use("/api", require("./routes/brochureRoutes"));
app.use("/api/admin-profile", require("./routes/adminRoutes"));
app.use("/api", require("./routes/demoRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));