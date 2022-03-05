const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
const helpers = require(path.join(__dirname, "scripts/helpers"));

require("dotenv").config();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use('/favicon.ico', express.static('static/favicon.ico'));

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Welcome to Waxxer!",
  });
})

app.post('/weather', async function (req, res) {
  const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
  const weatherApiUrl = process.env.OPENWEATHERMAP_BASE_URL;

  try {
    const weatherAndForecast = await helpers.performAllTheCalls(req.body.placename, weatherApiUrl, openWeatherMapApiKey);

    res.render("weather", {
      title: `☀️ 🌧 ❄️ 🌩`,
      wx: weatherAndForecast[0],
      fa: weatherAndForecast[1]
    });
  } catch (error) {
    res.send(error.toString())
  }
});

let PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT} 🚀`);

module.exports = app;
