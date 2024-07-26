const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an Insurance
const createInsurance = async (req, res) => {
  const { name } = req.body;

  try {
    const existingInsurance = await prisma.insuranceType.findUnique({
      where: { name },
    });

    if (existingInsurance) {
      return res
        .status(400)
        .json({ error: "Insurance with this name already exists" });
    }

    const insurance = await prisma.insuranceType.create({
      data: {
        name,
      },
    });

    res.status(201).json({ message: "Insurance created successfully", insurance });
  } catch (error) {
    res.status(500).json({ error: "Could not create insurance", details: error });
  }
};

// Get all Insurances
const getAllInsurance = async (req, res) => {
  try {
    const insurances = await prisma.insuranceType.findMany();
    res.json(insurances);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve insurances", details: error });
  }
};

// Get an Insurance by ID
const getInsuranceById = async (req, res) => {
  const { id } = req.params;

  try {
    const insurance = await prisma.insuranceType.findUnique({
      where: { id: Number(id) },
    });

    if (!insurance) {
      return res.status(404).json({ error: "Insurance not found" });
    }

    res.json(insurance);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve insurance", details: error });
  }
};

// Update an Insurance
const updateInsurance = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const insurance = await prisma.insuranceType.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(insurance);
  } catch (error) {
    res.status(500).json({ error: "Could not update insurance", details: error });
  }
};

// Delete an Insurance
const deleteInsurance = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.insuranceType.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Insurance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete insurance", details: error });
  }
};

module.exports = {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
};
