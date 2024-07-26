const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createYachtType = async (req, res) => {
  const { name } = req.body;
  try {
    const yachtType = await prisma.yachtType.create({
      data: { name },
    });
    res.status(201).json(yachtType);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not create yacht type", details: error });
  }
};

const getYachtTypes = async (req, res) => {
  try {
    const yachtTypes = await prisma.yachtType.findMany();
    res.status(200).json(yachtTypes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not fetch yacht types", details: error });
  }
};

const updateYachtType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const yachtType = await prisma.yachtType.update({
      where: { id: parseInt(id, 10) },
      data: { name },
    });
    res.status(200).json(yachtType);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update yacht type", details: error });
  }
};

const getYachtTypeById = async (req, res) => {
  const { id } = req.params;
  try {
   const yacht = await prisma.yachtType.findUnique({
      where: { id: parseInt(id, 10) },
    });
    res.json(yacht);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not fetch yacht type", details: error });
  }
};
const deleteYachtType = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.yachtType.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).json();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not delete yacht type", details: error });
  }
};

module.exports = {
  createYachtType,
  getYachtTypes,
  updateYachtType,
  deleteYachtType,
  getYachtTypeById,
};
