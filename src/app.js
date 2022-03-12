const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();

const weather = require(path.join(__dirname, "/routes/weather"));

require("dotenv").config();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/favicon.ico", express.static("favicon.ico"));
app.use("/", weather);

let PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT} 🚀`);

module.exports = app;
