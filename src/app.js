const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/admin/user/users");
const roleRoutes = require("./routes/admin/role/roleRoutes");
const bannerRoutes = require("./routes/admin/banner/bannerRoutes");
const carRoutes = require("./routes/dealer/car/carRoutes");
const carBrandRoutes = require("./routes/admin/carBrand/carBrandRoutes");
const insuranceRoutes = require("./routes/admin/insuranceType/insuranceRoutes");
const fuelRoutes = require("./routes/admin/fuelType/fuelRoutes");
const featuresRoutes = require("./routes/admin/carFeatures/carFeaturesRoutes");
const carTyperoutes = require("./routes/admin/carType/carTyperoutes");
const authRoutes = require("./routes/auth/auth");

const yachtTypeRoutes = require("./routes/admin/yachtType/yachtTypeRoutes");
const locationRoutes = require("./routes/admin/location/locationRoutes");
const yachtRoutes = require("./routes/dealer/yacht/yachtRoutes");
const packageRoutes = require("./routes/admin/package/packageRoutes");
const currencyRoutes = require("./routes/admin/currency/currencyRoutes");
// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL client setup
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Adjust as needed for your SSL configuration
  },
});

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Connection error", err.stack);
    process.exit(1); // Exit process if database connection fails
  });

// Middleware
app.use(bodyParser.json());

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/cars-brand", carBrandRoutes);
app.use("/api/insurance-type", insuranceRoutes);
app.use("/api/fuel-type", fuelRoutes);
app.use("/api/car-feature", featuresRoutes);
app.use("/api/car-type", carTyperoutes);

// yacht routes
app.use("/api/yacht-type", yachtTypeRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/yachts", yachtRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/currency", currencyRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
