const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const routes = require("./api/routes");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
