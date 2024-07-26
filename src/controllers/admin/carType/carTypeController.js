const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new CarType
const createCarType = async (req, res) => {
  const { name } = req.body;

  try {
    const carType = await prisma.carType.create({
      data: {
        name,
      },
    });
    res.status(201).json({ message: "Car type created successfully", carType });
  } catch (error) {
    console.error("Error creating car type:", error);
    res.status(500).json({ error: "Could not create car type", details: error });
  }
};

// Get all CarTypes
const getAllCarTypes = async (req, res) => {
  try {
    const carTypes = await prisma.carType.findMany();
    res.json({ message: "Car types fetched successfully", carTypes });
  } catch (error) {
    console.error("Error fetching car types:", error);
    res.status(500).json({ error: "Could not fetch car types", details: error });
  }
};

// Get a CarType by ID
const getCarTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const carType = await prisma.carType.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!carType) {
      return res.status(404).json({ error: "Car type not found" });
    }

    res.json(carType);
  } catch (error) {
    console.error("Error fetching car type:", error);
    res.status(500).json({ error: "Could not fetch car type", details: error });
  }
};

// Update a CarType by ID
const updateCarType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const carType = await prisma.carType.update({
      where: { id: parseInt(id, 10) },
      data: { name },
    });

    res.json({ message: "Car type updated successfully", carType });
  } catch (error) {
    console.error("Error updating car type:", error);
    res.status(500).json({ error: "Could not update car type", details: error });
  }
};

// Delete a CarType by ID
const deleteCarType = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.carType.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Car type deleted successfully" });
  } catch (error) {
    console.error("Error deleting car type:", error);
    res.status(500).json({ error: "Could not delete car type", details: error });
  }
};

module.exports = {
  createCarType,
  getAllCarTypes,
  getCarTypeById,
  updateCarType,
  deleteCarType,
};
