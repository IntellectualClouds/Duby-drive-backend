const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uploadFile = require("../../../utils/uploadFile");

const calculateDaysLeft = (createdAt, durationString) => {
  if (!createdAt || !durationString) {
    return 0; // Handle cases where inputs are missing
  }

  const durationDays = parseDurationToDays(durationString);

  const createdDate = new Date(createdAt);
  const expiryDate = new Date(createdDate);
  expiryDate.setDate(expiryDate.getDate() + durationDays);

  const now = new Date();
  const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  return daysLeft >= 0 ? daysLeft : 0;
};

// Convert duration string to number of days
const parseDurationToDays = (durationString) => {
  const durationRegex = /(\d+)\s*(day|week|month|year)s?/i;
  const match = durationRegex.exec(durationString);

  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case "day":
        return value;
      case "week":
        return value * 7;
      case "month":
        return value * 30; // Approximate
      case "year":
        return value * 365; // Approximate
      default:
        return 0;
    }
  }

  return 0; // Default to 0 if no match
};

const createDealer = async (req, res) => {
  const {
    name,
    contactNumber,
    whatsappNumber,
    nationality,
    packageId,
    dob,
    emiratesId,
    licenseNumber,
    vatNumber,
    mapLink,
    cities,
    deliveryAndPickup,
    languages,
    paymentMethods,
    fastDeliveryLocation,
    active,
    description,
    address,
    facebookLink,
    instagramLink,
    twitterLink,
    youtubeLink,
    tiktokLink,
    metaDescription,
    metaKeywords,
    userId,
  } = req.body;

  try {
    const logoUrl = await uploadFile(req.files.logo[0]);
    const vatDocumentUrl = await uploadFile(req.files.vatDocumentUrl[0]);
    const ejariDocumentUrl = await uploadFile(req.files.ejariDocumentUrl[0]);
    const insuranceDocumentUrl = await uploadFile(
      req.files.insuranceDocumentUrl[0]
    );
    const idCardUrl = await uploadFile(req.files.idCardUrl[0]);
    console.log(idCardUrl, "test");

    const package = await prisma.package.findUnique({
      where: { id: parseInt(packageId) },
    });
    console.log("Package:", package);

    if (!package) {
      return res.status(400).json({ error: "Invalid packageId provided" });
    }

    const citiesId = cities.split(",").map((id) => parseInt(id.trim(), 10));
    const deliveryIds = fastDeliveryLocation
      .split(",")
      .map((id) => parseInt(id.trim(), 10));

    console.log("Cities IDs:", citiesId);
    console.log("Fast Delivery Location IDs:", deliveryIds);

    // Adjust connection of cities and fastDeliveryLocation
    const dealer = await prisma.dealer.create({
      data: {
        name,
        userId: parseInt(userId, 10),
        logo: logoUrl,
        contactNumber,
        whatsappNumber,
        nationality,
        packageId: parseInt(packageId, 10),
        dob,
        emiratesId,
        licenseNumber,
        vatNumber,
        mapLink,
        cities: {
          connect: citiesId.map((id) => ({ id })), // Connect existing City records
        },
        deliveryAndPickup: deliveryAndPickup.split(","),
        languages: languages.split(","),
        paymentMethods: paymentMethods.split(","),
        fastDeliveryLocation: {
          connect: deliveryIds.map((id) => ({ id })), // Connect existing CityArea records
        },
        active: active === "true",
        description,
        address,
        facebookLink,
        instagramLink,
        twitterLink,
        youtubeLink,
        tiktokLink,
        metaDescription,
        metaKeywords: metaKeywords.split(","),
        vatDocumentUrl,
        ejariDocumentUrl,
        insuranceDocumentUrl,
        idCardUrl,
      },
    });

    res.status(201).json({ message: "Dealer created successfully", dealer });
  } catch (error) {
    console.error("Error creating dealer:", error);
    res
      .status(500)
      .json({ error: "Could not create dealer", details: error.message });
  }
};

// Update a Dealer
const updateDealer = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    contactNumber,
    whatsappNumber,
    nationality,
    packageId,
    dob,
    emiratesId,
    licenseNumber,
    vatNumber,
    mapLink,
    cities,
    deliveryAndPickup,
    languages,
    paymentMethods,
    fastDeliveryLocation,
    active,
    description,
    address,
    facebookLink,
    instagramLink,
    twitterLink,
    youtubeLink,
    tiktokLink,
    metaDescription,
    metaKeywords,
    cityId,
    cityAreaId,
  } = req.body;

  try {
    const updateData = {
      name,
      email,
      contactNumber,
      whatsappNumber,
      nationality,
      packageId: parseInt(packageId),
      dob: dob ? new Date(dob) : null,
      emiratesId,
      licenseNumber,
      vatNumber,
      mapLink,
      cities,
      deliveryAndPickup,
      languages,
      paymentMethods,
      fastDeliveryLocation,
      active: active === "true",
      description,
      address,
      facebookLink,
      instagramLink,
      twitterLink,
      youtubeLink,
      tiktokLink,
      metaDescription,
      metaKeywords,
      cityId: parseInt(cityId),
      cityAreaId: cityAreaId ? parseInt(cityAreaId) : null,
    };

    if (req.files.logo) updateData.logo = await uploadFile(req.files.logo[0]);
    if (req.files.vatDocument)
      updateData.vatDocumentUrl = await uploadFile(req.files.vatDocument[0]);
    if (req.files.ejariDocument)
      updateData.ejariDocumentUrl = await uploadFile(
        req.files.ejariDocument[0]
      );
    if (req.files.insuranceDocument)
      updateData.insuranceDocumentUrl = await uploadFile(
        req.files.insuranceDocument[0]
      );
    if (req.files.idCard)
      updateData.idCardUrl = await uploadFile(req.files.idCard[0]);

    const dealer = await prisma.dealer.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({ message: "Dealer updated successfully", dealer });
  } catch (error) {
    console.error("Error updating dealer:", error);
    res
      .status(500)
      .json({ error: "Could not update dealer", details: error.message });
  }
};

const getDealer = async (req, res) => {
  const { id } = req.params;

  try {
    const dealer = await prisma.dealer.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        package: true,
        cities: true,
        fastDeliveryLocation: true,
      },
    });

    if (dealer) {
      console.log("------", dealer);

      // Check if package and duration exist before calculating days left
      const daysLeft = dealer.package
        ? calculateDaysLeft(dealer.createdAt, dealer.package.duration)
        : 0;

      const dealerWithDaysLeft = {
        ...dealer,
        daysLeft,
      };
      res.json(dealerWithDaysLeft);
    } else {
      res.status(404).json({ error: "Dealer not found" });
    }
  } catch (error) {
    console.error("Error retrieving dealer:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve dealer", details: error.message });
  }
};

const getDealers = async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany({
      include: {
        package: true,
        user: true,
      },
    });

    const dealersWithDaysLeft = dealers.map((dealer) => ({
      ...dealer,
      daysLeft: calculateDaysLeft(dealer.createdAt, dealer.package.duration),
    }));

    res.json(dealersWithDaysLeft);
  } catch (error) {
    console.error("Error retrieving dealers:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve dealers", details: error.message });
  }
};

// Delete a Dealer
const deleteDealer = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.dealer.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Dealer deleted successfully" });
  } catch (error) {
    console.error("Error deleting dealer:", error);
    res
      .status(500)
      .json({ error: "Could not delete dealer", details: error.message });
  }
};

module.exports = {
  createDealer,
  updateDealer,
  getDealer,
  getDealers,
  deleteDealer,
};
