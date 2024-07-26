const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user and role from the database
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }, // Include the role relationship
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      process.env.TOKEN_SECRET
    );

    // Respond with user info and token
    const result = {
      email: user.email,
      role: user.role.name,
      profilePicture: user.profilePicture,
      token,
    };

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Could not log in", details: error });
  }
};

module.exports = { login };
