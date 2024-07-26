const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uploadFile = require("../../../utils/uploadFile");

// Create a CarBrand
const createCarBrand = async (req, res) => {
  const { brandName, description, activeStatus, descriptionStatus } = req.body;

  const existingCarBrand = await prisma.carBrand.findUnique({
    where: { brandName },
  });

  if (existingCarBrand) {
    return res
      .status(400)
      .json({ error: "CarBrand with this brandName already exists." });
  }

  const brandLogoUrl = await uploadFile(req.file);

  try {
    const carBrand = await prisma.carBrand.create({
      data: {
        brandName,
        brandLogo: brandLogoUrl,
        description,
        activeStatus,
        descriptionStatus,
      },
    });

    res
      .status(201)
      .json({ message: "CarBrand created successfully", carBrand });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not create car brand", details: error });
  }
};

// Get all CarBrands
const getAllCarBrands = async (req, res) => {
  try {
    const carBrands = await prisma.carBrand.findMany();
    res.json(carBrands);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve car brands", details: error });
  }
};

// Get a CarBrand by ID
const getCarBrandById = async (req, res) => {
  const { id } = req.params;

  try {
    const carBrand = await prisma.carBrand.findUnique({
      where: { id: Number(id) },
    });
    if (!carBrand) {
      return res.status(404).json({ error: "CarBrand not found" });
    }
    res.json(carBrand);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve car brand", details: error });
  }
};

// Update a CarBrand
const updateCarBrand = async (req, res) => {
  const { id } = req.params;
  const { brandName, brandLogo, description, activeStatus, descriptionStatus } =
    req.body;

  try {
    const updatedCarBrand = await prisma.carBrand.update({
      where: { id: Number(id) },
      data: {
        brandName,
        brandLogo,
        description,
        activeStatus,
        descriptionStatus,
      },
    });
    res.json(updatedCarBrand);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update car brand", details: error });
  }
};

// Delete a CarBrand
const deleteCarBrand = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.carBrand.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "CarBrand deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not delete car brand", details: error });
  }
};

module.exports = {
  createCarBrand,
  getAllCarBrands,
  getCarBrandById,
  updateCarBrand,
  deleteCarBrand,
};
