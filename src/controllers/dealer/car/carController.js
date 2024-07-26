const { PrismaClient } = require("@prisma/client");
const uploadFile = require("../../../utils/uploadFile");

const prisma = new PrismaClient();

const createCar = async (req, res) => {
  const data = req.body;
  const user = req.user;
  console.log(user, "tetet");
  try {
    let carImages = [];
    let carVideo = null;
    let featureImage = null;
    const existingCar = await prisma.car.findUnique({
      where: { licensePlate: data.licensePlate },
    });
    console.log(existingCar);
    if (existingCar) {
      return res
        .status(400)
        .json({ error: "A car with this license plate already exists" });
    }
    if (req.files) {
      const {
        carImages: imageFiles,
        carVideo: videoFiles,
        featureImage: featureFiles,
      } = req.files;
      if (featureFiles && featureFiles[0]) {
        featureImage = await uploadFile(featureFiles[0]);
      }

      if (videoFiles && videoFiles[0]) {
        carVideo = await uploadFile(videoFiles[0]);
      }

      if (imageFiles) {
        carImages = await Promise.all(
          imageFiles.map(async (file) => await uploadFile(file))
        );
      }
    }
    const featureIds = data.features.split(',').map(id => parseInt(id.trim(), 10));
    const existingFeatures = await prisma.feature.findMany({
      where: { id: { in: featureIds } },
    });

    const existingFeatureIds = existingFeatures.map(f => f.id);
    if (featureIds.length !== existingFeatureIds.length) {
      const missingFeatureIds = featureIds.filter(id => !existingFeatureIds.includes(id));
      return res.status(400).json({ error: "Some feature IDs are invalid", missingFeatureIds });
    }
    const featureConnect = featureIds.map(id => ({
      id,
    }));
    const parsedData = {
      modelNo: data.modelNo,
      licensePlate: data.licensePlate,
      brandId: parseInt(data.brandId, 10),
      typeId: parseInt(data.typeId, 10),
      features: {
        connect: featureConnect,
      },
      dealerId: parseInt(data.dealerId, 10),
      active: data.active,
      description: data.description,
      doors: parseInt(data.doors, 10),
      rentalDays: parseInt(data.rentalDays, 10),
      seats: parseInt(data.seats, 10),
      luggage: data.luggage,
      fuelTypeId: parseInt(data.fuelTypeId, 10),
      gssType: data.gssType,
      autoTransmission: data.autoTransmission,
      additionalMileageCharges: data.additionalMileageCharges,
      salikTollCharges: data.salikTollCharges,
      additionalDriverInsurance: data.additionalDriverInsurance,
      insuranceTypeId: parseInt(data.insuranceTypeId, 10),
      interiorColor: data.interiorColor,
      exteriorColor: data.exteriorColor,
      dayBasisMileageLimit: parseInt(data.dayBasisMileageLimit, 10),
      dayBasisCost: parseFloat(data.dayBasisCost),
      weeklyMileageLimit: parseInt(data.weeklyMileageLimit, 10),
      weeklyCost: parseFloat(data.weeklyCost),
      monthlyMileageLimit: parseInt(data.monthlyMileageLimit, 10),
      monthlyCost: parseFloat(data.monthlyCost),
      discountOfferPercentage: data.discountOfferPercentage,
      discountOfferDate: data.discountOfferDate,
      securityDeposit: data.securityDeposit,
      selectRefund: parseInt(data.selectRefund, 10),
      driverAge: parseInt(data.driverAge, 10),
      seoMeta: data.seoMeta,
      metaKeywords: data.metaKeywords.split(","),
      featureImage: featureImage,
      carImages: carImages,
      carVideo: carVideo,
      ownerId: user.id,
    };
    const car = await prisma.car.create({
      data: parsedData,
    });

    res.status(201).json({ message: "Car created successfully", car });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ error: "Could not create car", details: error });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json({ message: "Cars fetched successfully", result: cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Could not fetch cars", details: error });
  }
};

const getCarById = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(id) },
      include: {
        brand: true,
        type: true,
        fuelType: true,
        insuranceType: true,
        features: true,
        owner: true,
      },
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ error: "Could not fetch car", details: error });
  }
};

const updateCar = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const car = await prisma.car.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json(car);
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Could not update car", details: error });
  }
};

const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.car.delete({
      where: { id: Number(id) },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        cars: {
          disconnect: { id: Number(id) },
        },
      },
    });

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Could not delete car", details: error });
  }
};

module.exports = { createCar, getAllCars, getCarById, updateCar, deleteCar };
