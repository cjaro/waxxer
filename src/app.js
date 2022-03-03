const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

require("dotenv").config();

const app = express();

const indexRouter = require(path.join(__dirname, "../routes/indexRoute"));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);

let PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT} 🚀`);

module.exports = app;
