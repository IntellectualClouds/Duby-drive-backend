const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a banner
const createBanner = async (req, res) => {
  const { page, bannerNumber, active, html } = req.body;

  try {
    // Check if a banner with the same page and bannerNumber already exists
    const existingBanner = await prisma.banner.findFirst({
      where: {
        page,
        bannerNumber,
      },
    });

    if (existingBanner) {
      return res.status(400).json({ error: "Banner with the same page and banner number already exists" });
    }

    // Create a new banner if the combination does not exist
    const banner = await prisma.banner.create({
      data: {
        page,
        bannerNumber,
        active,
        html,
      },
    });

    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Could not create banner", details: error });
  }
};


// Get all banners
const getBanners = async (req, res) => {
  console.log(req.user)
  try {
    const banners = await prisma.banner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve banners", details: error });
  }
};

// Get a single banner by id
const getBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (banner) {
      res.json(banner);
    } else {
      res.status(404).json({ error: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve banner", details: error });
  }
};

// Delete a banner by id
const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.banner.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete banner", details: error });
  }
};

module.exports = {
  createBanner,
  getBanners,
  deleteBanner,
  getBanner,
};
