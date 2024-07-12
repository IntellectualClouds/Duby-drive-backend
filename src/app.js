// server.js
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/admin/user/users");
const roleRoute = require("./routes/admin/role/roleRoutes");
const bannerRoute = require("./routes/admin/banner/bannerRoutes");
const authRoute = require("./routes/auth/auth");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// Use routes from the routes folder
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/banner", bannerRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
