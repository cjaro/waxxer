const express = require('express');
const path = require("path");
const router = express.Router();
const helpers = require(path.join(__dirname, "../scripts/helpers"));

router.get("/", async (req, res) => {
  res.render("index", {
    title: "❄️ waxxer ❄️",
  });
})

router.post('/weather', async function (req, res) {
  console.log(`Working at weather route, querying weather in ${req.body.placename}`);
  const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
  const weatherApiUrl = process.env.OPENWEATHERMAP_BASE_URL;
  const geoCodeUrl = process.env.GEOCODE_BASE_URL;
  const geoCodeApiKey = process.env.GEOCODE_API_KEY;

  try {
    const weatherAndForecast = await helpers.gatherCurrentAndForecast(
      req.body.placename,
      weatherApiUrl,
      openWeatherMapApiKey,
      geoCodeUrl,
      geoCodeApiKey
    );

    res.render("weather", {
      title: `☀️ 🌧 waxxer ❄️ 🌩`,
      wx: weatherAndForecast[0],
      fa: weatherAndForecast[1]
    });
  } catch (error) {
    res.send(error.toString())
  }
});

module.exports = router;
