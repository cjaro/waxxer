const express = require('express');
const axios = require("axios");
const router = express.Router();

let openWeatherMapApiKey = process.env.OPENWEATHER_API_KEY;
let baseUrl = process.env.OPENWEATHERMAP_BASE_URL;
let reqLat = 45.8769;
let reqLong = -93.2938;
let openWeatherReqUrl = `${baseUrl}?lat=${reqLat}&lon=${reqLong}&appid=${openWeatherMapApiKey}`;

router.get('/', async function(req, res, next) {
  try {
    console.log(`Fetching the weather for ${reqLat}, ${reqLong}`);

    axios
      .get(openWeatherReqUrl)
      .then(result => {
        let weatherJson = result.data;
        // console.log(weatherJson);
        res.render("weather", {
          title: "☀️🌧 Weather! ❄️🌩",
          weather: weatherJson
        });
      })
      .catch(error => {
        console.error(error);
      });
  } catch (error) {
    console.log(error.toString());
    res.render("error", {
      title: "Error",
      error: error.toString()
    })
  }
});

module.exports = router;
