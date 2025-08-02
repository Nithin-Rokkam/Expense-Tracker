require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend if build directory exists
const clientBuildPath = path.join(__dirname, "client/build");
if (require("fs").existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // Catch-all route for React app
  app.get("/*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  // If no build directory, just serve API
  app.get("/", (req, res) => {
    res.json({ message: "Expense Tracker API is running" });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
