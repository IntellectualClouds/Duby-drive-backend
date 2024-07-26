const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createLocation = async (req, res) => {
  const { name } = req.body;
  try {
    const location = await prisma.location.create({
      data: { name },
    });
    res.status(201).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not create location", details: error });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany();
    res.status(200).json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not fetch locations", details: error });
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const location = await prisma.location.update({
      where: { id: parseInt(id, 10) },
      data: { name },
    });
    res.status(200).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update location", details: error });
  }
};

const getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const location =await prisma.location.findUnique({
      where: { id: parseInt(id, 10) },
    });
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch location", details: error });
  }
};
const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.location.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).json();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not delete location", details: error });
  }
};

module.exports = {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  getLocationById,
};
