const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCurrency = async (req, res) => {
  const { name } = req.body;
  try {
    const newCurrency = await prisma.currency.create({
      data: { name },
    });

    res.status(201).json({
      message: "Currency created successfully",
      currency: newCurrency,
    });
  } catch (error) {
    console.error("Error creating currency:", error);
    res
      .status(500)
      .json({ error: "Could not create currency", details: error.message });
  }
};

const getCurrencies = async (req, res) => {
  try {
    const currencies = await prisma.currency.findMany();
    res.json(currencies);
  } catch (error) {
    console.error("Error retrieving currencies:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve currencies", details: error.message });
  }
};

const getCurrency = async (req, res) => {
  const { id } = req.params;

  try {
    const currency = await prisma.currency.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (currency) {
      res.json(currency);
    } else {
      res.status(404).json({ error: "Currency not found" });
    }
  } catch (error) {
    console.error("Error retrieving currency:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve currency", details: error.message });
  }
};

const updateCurrency = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedCurrency = await prisma.currency.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: data.name,
      },
    });

    res.json({
      message: "Currency updated successfully",
      currency: updatedCurrency,
    });
  } catch (error) {
    console.error("Error updating currency:", error);
    res
      .status(500)
      .json({ error: "Could not update currency", details: error.message });
  }
};

const deleteCurrency = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.currency.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Currency deleted successfully" });
  } catch (error) {
    console.error("Error deleting currency:", error);
    res
      .status(500)
      .json({ error: "Could not delete currency", details: error.message });
  }
};

module.exports = {
  createCurrency,
  getCurrencies,
  getCurrency,
  updateCurrency,
  deleteCurrency,
};
