const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createRole = async (req, res) => {
  const { roleName } = req.body;

  try {
    // Check if the role with the same name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (existingRole) {
      return res.status(400).json({ error: "Role already exists" });
    }

    // Create the new role
    const role = await prisma.role.create({
      data: {
        name: roleName,
      },
    });

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ error: "Could not create role", details: error });
  }
};


const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve roles", details: error });
  }
};

const getRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve role", details: error });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const role = await prisma.role.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: updateData.roleName,
        permissions: updateData.permissions,
      },
    });

    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Could not update role", details: error });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.role.delete({
      where: { id },
    });

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete role", details: error });
  }
};

module.exports = {
  createRole,
  getRole,
  updateRole,
  deleteRole,
  getRoles,
};
