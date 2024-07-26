const { PrismaClient } = require("@prisma/client");
const uploadFile = require("../../../utils/uploadFile");
const prisma = new PrismaClient();
const parseBoolean = (value) => value === "true";

const createYacht = async (req, res) => {
  const data = req.body;

  try {
    let images = [];
    let video = null;
    if (req.files) {
      const { images: imageFiles, video: videoFiles } = req.files;

      if (videoFiles && videoFiles[0]) {
        video = await uploadFile(videoFiles[0]);
      }

      if (imageFiles) {
        images = await Promise.all(
          imageFiles.map(async (file) => await uploadFile(file))
        );
      }
    }
    const parsedData = {
      ...data,
      dealerId: parseInt(data.dealerId, 10),
      yachtTypeId: parseInt(data.yachtTypeId, 10),
      locationId: parseInt(data.locationId, 10),
      captain: parseBoolean(data.captain),
      crew: parseBoolean(data.crew),
      active: parseBoolean(data.active),
      ice: parseBoolean(data.ice),
      water: parseBoolean(data.water),
      softDrinks: parseBoolean(data.softDrinks),
      freeFuel: parseBoolean(data.freeFuel),
      towel: parseBoolean(data.towel),
      bbqEquipment: parseBoolean(data.bbqEquipment),
      kidsWelcome: parseBoolean(data.kidsWelcome),
      musicSystem: parseBoolean(data.musicSystem),
      freeRefreshment: parseBoolean(data.freeRefreshment),
      fishingEquipment: parseBoolean(data.fishingEquipment),
      safetyEquipment: parseBoolean(data.safetyEquipment),
      bluetooth: parseBoolean(data.bluetooth),
      usbPort: parseBoolean(data.usbPort),
      aux: parseBoolean(data.aux),
      shower: parseBoolean(data.shower),
      pillowsBlanket: parseBoolean(data.pillowsBlanket),
      cooler: parseBoolean(data.cooler),
      airConditioner: parseBoolean(data.airConditioner),
      microwave: parseBoolean(data.microwave),
      insideSpeaker: parseBoolean(data.insideSpeaker),
      outsideSpeaker: parseBoolean(data.outsideSpeaker),
      audioSystem: parseBoolean(data.audioSystem),
      metaKeywords: data.metaKeywords.split(","),
      images: images,
      video: video,
    };

    const yacht = await prisma.yacht.create({
      data: parsedData,
    });

    res.status(201).json({ message: "Yacht created successfully", yacht });
  } catch (error) {
    console.error("Error creating yacht:", error);
    res.status(500).json({ error: "Could not create yacht", details: error });
  }
};

const getYachts = async (req, res) => {
  try {
    const yachts = await prisma.yacht.findMany({
      include: {
        yachtType: true,
        dealer: true,
        location: true,
      },
    });
    res.status(200).json(yachts);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch yachts", details: error });
  }
};

const updateYacht = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    let images = [];
    let video = null;
    if (req.files) {
      const { images: imageFiles, video: videoFiles } = req.files;

      if (videoFiles && videoFiles[0]) {
        video = await uploadFile(videoFiles[0]);
      }

      if (imageFiles) {
        images = await Promise.all(
          imageFiles.map(async (file) => await uploadFile(file))
        );
      }
    }
    const parsedData = {
      ...data,
      yachtTypeId: parseInt(data.yachtTypeId, 10),
      locationId: parseInt(data.locationId, 10),
      active: data.active,
      ice: data.ice,
      water: data.water,
      softDrinks: data.softDrinks,
      freeFuel: data.freeFuel,
      towel: data.towel,
      bbqEquipment: data.bbqEquipment,
      kidsWelcome: data.kidsWelcome,
      musicSystem: data.musicSystem,
      freeRefreshment: data.freeRefreshment,
      fishingEquipment: data.fishingEquipment,
      safetyEquipment: data.safetyEquipment,
      bluetooth: data.bluetooth,
      usbPort: data.usbPort,
      aux: data.aux,
      shower: data.shower,
      pillowsBlanket: data.pillowsBlanket,
      cooler: data.cooler,
      airConditioner: data.airConditioner,
      microwave: data.microwave,
      insideSpeaker: data.insideSpeaker,
      outsideSpeaker: data.outsideSpeaker,
      audioSystem: data.audioSystem,
      images: images,
      video: video,
    };

    const yacht = await prisma.yacht.update({
      where: { id: parseInt(id, 10) },
      data: parsedData,
    });

    res.status(200).json({ message: "Yacht updated successfully", yacht });
  } catch (error) {
    res.status(500).json({ error: "Could not update yacht", details: error });
  }
};

const getYachtById = async (req, res) => {
  const { id } = req.params;

  try {
    const yacht = await prisma.yacht.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        dealer: true,
        location: true,
        yachtType: true,
      },
    });

    res.json(yacht);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch yacht", details: error });
  }
};
const deleteYacht = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.yacht.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).json({ message: "Yacht deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete yacht", details: error });
  }
};

module.exports = {
  createYacht,
  getYachts,
  updateYacht,
  deleteYacht,
  getYachtById,
};
