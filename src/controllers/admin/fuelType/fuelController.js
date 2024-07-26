const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new fuel type
const createFuelType = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if fuel type with the same name already exists
    const existingFuelType = await prisma.fuelType.findUnique({
      where: { name },
    });

    if (existingFuelType) {
      return res
        .status(400)
        .json({ error: "Fuel type with this name already exists" });
    }

    // If fuel type name does not exist, create a new one
    const fuelType = await prisma.fuelType.create({
      data: { name },
    });

    res.status(201).json({ message: "Fuel type created successfully", fuelType });
  } catch (error) {
    console.error("Error creating fuel type:", error);
    res.status(500).json({ error: "Could not create fuel type", details: error });
  }
};

// Get all fuel types
const getAllFuelTypes = async (req, res) => {
  try {
    const fuelTypes = await prisma.fuelType.findMany();
    res.json(fuelTypes);
  } catch (error) {
    console.error("Error fetching fuel types:", error);
    res.status(500).json({ error: "Could not retrieve fuel types", details: error });
  }
};

// Get fuel type by ID
const getFuelTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const fuelType = await prisma.fuelType.findUnique({
      where: { id: Number(id) },
    });

    if (!fuelType) {
      return res.status(404).json({ error: "Fuel type not found" });
    }

    res.json(fuelType);
  } catch (error) {
    console.error("Error fetching fuel type:", error);
    res.status(500).json({ error: "Could not retrieve fuel type", details: error });
  }
};

// Update fuel type
const updateFuelType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const fuelType = await prisma.fuelType.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(fuelType);
  } catch (error) {
    console.error("Error updating fuel type:", error);
    res.status(500).json({ error: "Could not update fuel type", details: error });
  }
};

// Delete fuel type
const deleteFuelType = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.fuelType.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Fuel type deleted successfully" });
  } catch (error) {
    console.error("Error deleting fuel type:", error);
    res.status(500).json({ error: "Could not delete fuel type", details: error });
  }
};

module.exports = {
  createFuelType,
  getAllFuelTypes,
  getFuelTypeById,
  updateFuelType,
  deleteFuelType,
};
