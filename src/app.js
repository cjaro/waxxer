const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const { Client } = require("pg");
// const client = new Client();
// client.connect();

const weatherRouter = require(path.join(__dirname,"../routes/weatherRoute"));

app.use("/weather", weatherRouter);

app.get("/", (req, res) => {
  console.log("Hello world!! 🚀")
    res.send("Hello world!! 🚀");
});

let PORT = 5000;

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT} 🚀`);

module.exports = app;
