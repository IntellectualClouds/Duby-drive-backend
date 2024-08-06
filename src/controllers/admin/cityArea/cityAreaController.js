const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllCityAreas = async (req, res) => {
  try {
    const cityAreas = await prisma.cityArea.findMany();
    res.json(cityAreas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCityAreaById = async (req, res) => {
  const { id } = req.params;
  try {
    const cityArea = await prisma.cityArea.findUnique({
      where: { id: parseInt(id) },
      include: {
        city: true,
      },
    });
    if (cityArea) {
      res.json(cityArea);
    } else {
      res.status(404).json({ error: "City Area not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCityArea = async (req, res) => {
  const { name, latitude, longitude, active, cityId } = req.body;
  try {
    const existingCityArea = await prisma.cityArea.findUnique({
      where: { name },
    });

    if (existingCityArea) {
      return res.status(409).json({ error: "City Area name already exists" });
    }

    const cityArea = await prisma.cityArea.create({
      data: {
        name,
        latitude,
        longitude,
        active: active === "true",
        cityId: parseInt(cityId),
      },
    });
    res.status(201).json(cityArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCityArea = async (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude, active, cityId } = req.body;
  try {
    if (name) {
      const existingCityArea = await prisma.cityArea.findUnique({
        where: { name },
      });

      if (existingCityArea && existingCityArea.id !== parseInt(id)) {
        return res.status(409).json({ error: "City area name already exists" });
      }
    }

    const updateData = {
      name,
      latitude,
      longitude,
      active: active === "true",
    };
    if (cityId) {
      updateData.city = {
        connect: { id: parseInt(cityId) },
      };
    }
    const cityArea = await prisma.cityArea.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(cityArea);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCityArea = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cityArea.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCityAreas,
  getCityAreaById,
  createCityArea,
  updateCityArea,
  deleteCityArea,
};
