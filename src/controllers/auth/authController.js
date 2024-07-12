// src/controllers/userController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { docClient } = require("../../config/dynamodb");

// Login a user
const tableName = "Users";
const login = async (req, res) => {
  const { email, password } = req.body;

  const params = {
    TableName: tableName,
    IndexName: "EmailIndex", // Ensure this matches your GSI name
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const data = await docClient.query(params).promise();

    if (data.Items.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = data.Items[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );
    const result = {
      email: user.email,
      role: user.role,
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
