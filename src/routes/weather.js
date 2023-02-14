const express = require('express');
const path = require("path");
const router = express.Router();
const helpers = require(path.join(__dirname, "../scripts/helpers"));

router.get("/", async (req, res) => {
  console.log("Hello!");
  res.render("pages/index", {
    title: "waxxer",
  });
})

router.post('/weather', async function (req, res) {
  console.log(`Working at weather route, querying weather in ${req.body.placename}`);
  const openWeatherMapApiKey = process.env.OPENWEATHER_API_KEY;
  const weatherApiUrl = process.env.OPENWEATHER_BASE_URL;
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

    res.render("pages/weather", {
      title: `waxxer`,
      wx: weatherAndForecast[0],
      fa: weatherAndForecast[1]
    });
  } catch (error) {
    res.send(error.toString())
  }
});

module.exports = router;
