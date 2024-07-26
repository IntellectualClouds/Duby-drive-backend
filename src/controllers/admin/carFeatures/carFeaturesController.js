const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new feature
const createFeature = async (req, res) => {
  const { name } = req.body;

  try {
    const feature = await prisma.feature.create({
      data: { name },
    });
    res.status(201).json({ message: "Feature created successfully", feature });
  } catch (error) {
    console.error("Error creating feature:", error);
    res.status(500).json({ error: "Could not create feature", details: error });
  }
};

// Get all features
const getAllFeatures = async (req, res) => {
  try {
    const features = await prisma.feature.findMany();
    res.json({ message: "Features fetched successfully", features });
  } catch (error) {
    console.error("Error fetching features:", error);
    res.status(500).json({ error: "Could not fetch features", details: error });
  }
};

// Get a single feature by ID
const getFeatureById = async (req, res) => {
  const { id } = req.params;

  try {
    const feature = await prisma.feature.findUnique({
      where: { id: Number(id) },
    });

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    res.json(feature);
  } catch (error) {
    console.error("Error fetching feature:", error);
    res.status(500).json({ error: "Could not fetch feature", details: error });
  }
};

// Update a feature by ID
const updateFeature = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const feature = await prisma.feature.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(feature);
  } catch (error) {
    console.error("Error updating feature:", error);
    res.status(500).json({ error: "Could not update feature", details: error });
  }
};

// Delete a feature by ID
const deleteFeature = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.feature.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    console.error("Error deleting feature:", error);
    res.status(500).json({ error: "Could not delete feature", details: error });
  }
};

module.exports = { createFeature, getAllFeatures, getFeatureById, updateFeature, deleteFeature };
