const { v4: uuidv4 } = require("uuid");
const { docClient } = require("../../../config/dynamodb");

const tableName = "Banners";

// Create a banner
const createBanner = async (req, res) => {
  const { page, bannerNumber, status, html } = req.body;

  const banner = {
    bannerId: uuidv4(),
    page,
    bannerNumber,
    status,
    html,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: tableName,
    Item: banner,
  };

  try {
    await docClient.put(params).promise();
    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Could not create banner", details: error });
  }
};

const getBanners = async (req, res) => {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await docClient.scan(params).promise();
    if (data.Items) {
      res.json(data.Items);
    } else {
      res.status(404).json({ error: "Banner not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve Banner", details: error });
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: tableName,
    Key: { bannerId: id },
  };

  try {
    await docClient.delete(params).promise();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete Banner", details: error });
  }
};
const getBanner = async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: tableName,
    Key: { bannerId: id },
  };

  try {
    const result = await docClient.get(params).promise();
    res.json({ message: "Banner reterived successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Could not found Banner", details: error });
  }
};

module.exports = {
  createBanner,
  getBanners,
  deleteBanner,
  getBanner,
};
