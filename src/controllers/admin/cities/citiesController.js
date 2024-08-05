const { PrismaClient } = require("@prisma/client");
const uploadFile = require("../../../utils/uploadFile");
const prisma = new PrismaClient();

const getAllCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCityById = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await prisma.city.findUnique({ where: { id: parseInt(id) } });
    if (city) {
      res.json(city);
    } else {
      res.status(404).json({ error: "City not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCity = async (req, res) => {
  const { name, active } = req.body;
  try {
    const existingCity = await prisma.city.findUnique({
      where: { name },
    });

    if (existingCity) {
      return res.status(409).json({ error: "City name already exists" });
    }
    const cityImageurl = await uploadFile(req.file);
    const city = await prisma.city.create({
      data: {
        name,
        image: cityImageurl,
        active: active === "true",
      },
    });
    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCity = async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;
  let cityImageurl;
  if (req.file) {
     cityImageurl = await uploadFile(req.file);
  }
  try {
    if (name) {
      const existingCity = await prisma.city.findUnique({
        where: { name },
      });

      if (existingCity) {
        return res.status(409).json({ error: "City name already exists" });
      }
    }
    const city = await prisma.city.update({
      where: { id: parseInt(id) },
      data: {
        name,
        image: cityImageurl,
        active: active === "true",
      },
    });
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCity = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.city.delete({ where: { id: parseInt(id) } });
    res.status(204).json('City deleted successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
