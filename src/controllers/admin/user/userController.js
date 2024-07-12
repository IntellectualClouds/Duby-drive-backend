// userController.js
const { docClient } = require("../../../config/dynamodb");
const { v4: uuidv4 } = require("uuid");
const uploadFile = require("../../../utils/uploadFile");
const bcrypt = require("bcrypt");
const sendEmail = require("../../../services/sendEmail");

const tableName = "Users";

const createUser = async (req, res) => {
  const { fullname, email, password, phonenumber, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePictureUrl = await uploadFile(req.file);
    const user = {
      userId: uuidv4(),
      fullname,
      email,
      password: hashedPassword,
      phonenumber,
      role,
      profilePicture: profilePictureUrl,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: tableName,
      Item: user,
    };
    const emailSubject = "Welcome to Duby Drive";
    const emailBody = `<h1>Welcome, ${fullname}</h1><p>Your account has been created successfully.</p>`;
    await sendEmail(email, emailSubject, emailBody);
    const result = await docClient.put(params).promise();

    res.status(201).json({ message: "User created successfully", result });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Could not create user", details: error });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  const params = {
    TableName: tableName,
    Key: { userId },
  };

  try {
    const data = await docClient.get(params).promise();
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve user", details: error });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  let updateExpression = "set ";
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  // Dynamically build UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
  Object.keys(updateData).forEach((key, index) => {
    const attributeName = `#${key}`;
    const attributeValue = `:${key}`;

    updateExpression += `${attributeName} = ${attributeValue}`;
    expressionAttributeNames[attributeName] = key;
    expressionAttributeValues[attributeValue] = updateData[key];

    if (index < Object.keys(updateData).length - 1) {
      updateExpression += ", ";
    }
  });

  const params = {
    TableName: tableName,
    Key: { userId: id }, 
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await docClient.update(params).promise();
    res.json(data.Attributes);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Could not update user", details: error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: tableName,
    Key: { userId: id },
  };

  try {
    await docClient.delete(params).promise();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete user", details: error });
  }
};

const getUsers = async (req, res) => {
  const params = {
    TableName: tableName,
  };

  try {
    const result = await docClient.scan(params).promise();
    res.json({ message: "Users fetch successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Could not find users", details: error });
  }
};

const getUserByRole = async (req, res) => {
  const { id } = req.params;
  console.log(id, "000000000000000");
  const userParams = {
    TableName: tableName,
    Key: { userId: id },
  };

  try {
    const userData = await docClient.get(userParams).promise();
    if (!userData.Item) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userData.Item;

    const roleParams = {
      TableName: "Roles",
      Key: { roleId: user.role },
    };

    const roleData = await docClient.get(roleParams).promise();
    if (roleData.Item) {
      user.role = roleData.Item;
    } else {
      user.role = null;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve user", details: error });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserByRole,
  getUsers,
};
