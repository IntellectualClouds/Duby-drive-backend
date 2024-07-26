const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const uploadFile = require("../../../utils/uploadFile");
const sendEmail = require("../../../services/sendEmail");

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  const { fullname, email, password, phoneNumber, role, active } = req.body;
  try {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const roleExists = await prisma.role.findUnique({
      where: { id: parseInt(role, 10) },
    });
    if (!roleExists) {
      return res.status(400).json({ error: "Invalid roleId provided" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePictureUrl = await uploadFile(req.file);
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phoneNumber,
        roleId: parseInt(role, 10),
        profilePicture: profilePictureUrl,
        active,
      },
    });

    const emailSubject = "Welcome to Duby Drive";
    const emailBody = `<h1>Welcome, ${fullname}</h1><p>Your account has been created successfully.</p>`;
    await sendEmail(email, emailSubject, emailBody);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Could not create user", details: error });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        cars: true,
        yachts: true,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve user", details: error });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Could not update user", details: error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete user", details: error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ error: "Could not find users", details: error });
  }
};


module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
};
