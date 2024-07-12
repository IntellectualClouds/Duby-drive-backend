// controllers/roleController.js
const { docClient } = require("../../../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const tableName = "Roles";

const createRole = async (req, res) => {
  const { roleName } = req.body;

  const role = {
    roleId: uuidv4(),
    roleName,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: tableName,
    Item: role,
  };

  try {
    await docClient.put(params).promise();
    res.status(201).json({ message: "Role created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not create role", details: error });
  }
};

const getRoles = async (req, res) => {

  const params = {
    TableName: tableName,
  };

  try {
    const data = await docClient.scan(params).promise();
    console.log(data)
    if (data.Items) {
      res.json(data.Items);
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve role", details: error });
  }
};
const getRole = async (req, res) => {
  const { roleId } = req.params;

  const params = {
    TableName: tableName,
    Key: { roleId },
  };

  try {
    const data = await docClient.get(params).promise();
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve role", details: error });
  }
};

const updateRole = async (req, res) => {
  const { roleId } = req.params;
  const updateData = req.body;

  const params = {
    TableName: tableName,
    Key: { roleId },
    UpdateExpression: "set roleName = :roleName, permissions = :permissions",
    ExpressionAttributeValues: {
      ":roleName": updateData.roleName,
      ":permissions": updateData.permissions,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await docClient.update(params).promise();
    res.json(data.Attributes);
  } catch (error) {
    res.status(500).json({ error: "Could not update role", details: error });
  }
};

const deleteRole = async (req, res) => {
  const { roleId } = req.params;

  const params = {
    TableName: tableName,
    Key: { roleId },
  };

  try {
    await docClient.delete(params).promise();
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete role", details: error });
  }
};

module.exports = {
  createRole,
  getRole,
  updateRole,
  deleteRole,
  getRoles
};
