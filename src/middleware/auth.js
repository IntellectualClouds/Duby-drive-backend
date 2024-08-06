// src/middleware/auth.js

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Assuming you have a Prisma client setup

// Load environment variables from .env file
dotenv.config();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    // Fetch the user's dealer data including the package
    const dealer = await prisma.dealer.findUnique({
      where: { userId: req.user.id },
      include: { package: true },
    });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    const currentDate = new Date();
    const startDate = new Date(dealer.startDate);
    const duration = dealer.package.duration;
    const endDate = new Date(startDate);

    if (duration.includes("Year")) {
      const years = parseInt(duration.split(" ")[0], 10);
      endDate.setFullYear(startDate.getFullYear() + years);
    } else if (duration.includes("Month")) {
      const months = parseInt(duration.split(" ")[0], 10);
      endDate.setMonth(startDate.getMonth() + months);
    }

    const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      // Deactivate all cars and yachts
      await prisma.car.updateMany({
        where: { dealerId: dealer.id },
        data: { active: false },
      });

      await prisma.yacht.updateMany({
        where: { dealerId: dealer.id },
        data: { active: false },
      });

      return res
        .status(403)
        .json({
          message:
            "Package expired. All cars and yachts have been deactivated.",
        });
    }

    req.user.daysLeft = daysLeft;

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to verify role
const verifyRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res
      .status(403)
      .json({ message: "Access forbidden: insufficient permissions" });
  }
  next();
};

module.exports = { verifyToken, verifyRole };
