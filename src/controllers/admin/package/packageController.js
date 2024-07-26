const { PrismaClient } = require("@prisma/client");
const uploadFile = require("../../../utils/uploadFile");
const prisma = new PrismaClient();

const createPackage = async (req, res) => {
  const data = req.body;

  try {
    const logoUrl = await uploadFile(req.file);
    const newPackage = await prisma.package.create({
      data: {
        name: data.name,
        duration: data.duration,
        logo: logoUrl,
        sellPrice: data.sellPrice,
        offerPrice: data.offerPrice,
        currencyId: parseInt(data.currencyId, 10),
        carsLimit: parseInt(data.carsLimit, 10),
        description: data.description,
        verify: data.verify === "true",
        featured: data.featured === "true",
        premium: data.premium === "true",
        active: data.active === "true",
      },
    });
    res
      .status(201)
      .json({ message: "Package created successfully", package: newPackage });
  } catch (error) {
    console.error("Error creating package:", error);
    res
      .status(500)
      .json({ error: "Could not create package", details: error.message });
  }
};

const getPackages = async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: {
        currency: true,
      },
    });

    res.json(packages);
  } catch (error) {
    console.error("Error retrieving packages:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve packages", details: error.message });
  }
};

const getPackage = async (req, res) => {
  const { id } = req.params;

  try {
    const package = await prisma.package.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        currency: true,
      },
    });

    if (package) {
      res.json(package);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    console.error("Error retrieving package:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve package", details: error.message });
  }
};

const updatePackage = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const updateData = {};

  if (data.name) updateData.name = data.name;
  if (data.duration) updateData.duration = data.duration;
  if (data.logo) updateData.logo = data.logo;
  if (data.sellPrice) updateData.sellPrice = data.sellPrice;
  if (data.offerPrice) updateData.offerPrice = data.offerPrice;
  if (data.currencyId) updateData.currencyId = parseInt(data.currencyId, 10);
  if (data.carsLimit) updateData.carsLimit = parseInt(data.carsLimit, 10);
  if (data.description) updateData.description = data.description;
  if (data.verify !== undefined) updateData.verify = data.verify === "true";
  if (data.featured !== undefined)
    updateData.featured = data.featured === "true";
  if (data.premium !== undefined) updateData.premium = data.premium === "true";
  if (data.active !== undefined) updateData.active = data.active === "true";

  try {
    const updatedPackage = await prisma.package.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.json({
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    res
      .status(500)
      .json({ error: "Could not update package", details: error.message });
  }
};

const deletePackage = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.package.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res
      .status(500)
      .json({ error: "Could not delete package", details: error.message });
  }
};

module.exports = {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
};
