const express = require("express");
const path = require("path");
const router = express.Router();
const helpers = require(path.join(__dirname, "../scripts/helpers"));

router.get("/", async (req, res) => {
  console.log("GET weather");
  res.render("pages/index", {
    title: "waxxer"
  });
});

router.post("/weather", async function (req, res) {
  console.log(`POST weather; querying weather in ${req.body.placename}`);
  const geoCodeApiUrl = process.env.GEOCODE_BASE_URL;
  const geoCodeApiKey = process.env.GEOCODE_API_KEY;

  try {
    const geoCodeUrl = helpers.constructGeoCodeUrl(req.body.placename, geoCodeApiUrl, geoCodeApiKey);
    const geoCodeApiData = await helpers.queryAPI(geoCodeUrl);
    const stateAndCountyInfo = helpers.getStateAndCounty(geoCodeApiData.results[0].address_components);
    const lat = geoCodeApiData.results[0].geometry.location.lat;
    const long = geoCodeApiData.results[0].geometry.location.lng;
    
    const mapUrl = helpers.constructMapUrl(req.body.placename, lat, long);
    const weatherUrl = helpers.constructWeatherApiQueryUrl('weather', lat, long);
    const forecastUrl = helpers.constructWeatherApiQueryUrl('forecast', lat, long);

    const queryWeather = await helpers.queryAPI(weatherUrl);
    const weather = helpers.formatWeatherData(queryWeather, stateAndCountyInfo, mapUrl);

    const queryForecast = await helpers.queryAPI(forecastUrl);
    const forecastObject = helpers.buildForecastObject(queryForecast.list);
    const forecast = helpers.groupByDay(forecastObject);

    try {
      res.render("pages/weather", {
        title: "waxxer",
        wx: weather,
        fa: forecast
      });
    } catch (error) {
      res.send(error.toString());
    }
  } catch (e) {
    res.send(e.toString());
  }
});

module.exports = router;
