const express = require('express');
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index", {
    title: "☀️ 🌧 Query the weather, wherever you're heading ❄️ 🌩",
  });
})

router.post('/weather', async function (req, res) {
  const openWeatherMapApiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = process.env.OPENWEATHERMAP_BASE_URL;

  const geoCodeUrl = constructGeoCodeUrl(req.body.placename);
  const geoCodeApiData = await queryAPI(geoCodeUrl);
  const stateAndCountyInfo = getStateAndCounty(geoCodeApiData);

  const lat = geoCodeApiData.results[0].geometry.location.lat;
  const long = geoCodeApiData.results[0].geometry.location.lng;

  try {
    // could call queryApi() here but need to render pug view
    axios
      .get(`${baseUrl}?lat=${lat}&lon=${long}&appid=${openWeatherMapApiKey}`)
      .then(result => {
        console.log(result.data);
        let formattedWeather = formatWeatherData(result.data, stateAndCountyInfo);

        res.render("weather", {
          title: "☀️ 🌧 Weather! ❄️ 🌩",
          wx: formattedWeather,
        });
      })
      .catch(error => {
        console.error(error);
      });
  } catch (error) {
    res.send(error.toString())
  }
});

function formatWeatherData(weatherInfo, stateAndCountyInfo) {
  let weatherArray = {
    "location": {
      "name": weatherInfo.name,
      "state": stateAndCountyInfo.stateAbbr,
      "stateFull": stateAndCountyInfo.stateLongName,
      "county": stateAndCountyInfo.county,
      "country": weatherInfo.sys.country,
      "latitude": weatherInfo.coord.lat,
      "longitude": weatherInfo.coord.lon
    },
    "conditions": {
      "openWeatherMapId": weatherInfo.weather[0].id,
      "condition": weatherInfo.weather[0].main,
      "conditionDescription": weatherInfo.weather[0].description,
      "iconCode": weatherInfo.weather[0].icon
    },
    "temps": {
      "currentTempC": (weatherInfo.main.temp - 273.15).toFixed(1),
      "currentTempF": ((weatherInfo.main.temp - 273.15) * 9/5 + 32).toFixed(1),
      "tempHighC": (weatherInfo.main.temp_max - 273.15).toFixed(1),
      "tempHighF": ((weatherInfo.main.temp_max - 273.15) * 9/5 + 32).toFixed(1),
      "tempLowC": (weatherInfo.main.temp_min - 273.15).toFixed(1),
      "tempLowF": ((weatherInfo.main.temp_min - 273.15) * 9/5 + 32).toFixed(1),
      "feelsLikeC": (weatherInfo.main.feels_like - 273.15).toFixed(1),
      "feelsLikeF": ((weatherInfo.main.feels_like - 273.15) * 9/5 + 32).toFixed(1)
    },
    "humidity": weatherInfo.main.humidity,
    "pressure": weatherInfo.main.pressure,
    "windSpeed": weatherInfo.wind.speed,
    "cloudCover": weatherInfo.clouds.all
  };

  console.log(weatherArray);

  return weatherArray;
}

function changeWeatherCode(iconCode) {}

function recommendWax(tempCelsius, humidity, condition, conditionDescription) {}

// state/county info not always in the same index in the Google API response
function getStateAndCounty(geoCodeData) {
  let stateAndCounty = {};
  for (let i = 0; i < geoCodeData.results[0].address_components.length; i++) {
    if (geoCodeData.results[0].address_components[i].types[0] === "administrative_area_level_1") {
      stateAndCounty.stateAbbr = geoCodeData.results[0].address_components[i].short_name;
      stateAndCounty.stateLongName = geoCodeData.results[0].address_components[i].long_name;
    }
    if (geoCodeData.results[0].address_components[i].types[0] === "administrative_area_level_2") {
      stateAndCounty.county = geoCodeData.results[0].address_components[i].long_name;
    }
  }
  return stateAndCounty;
}

function constructGeoCodeUrl(placeName) {
  return `${process.env.GEOCODE_BASE_URL}?address=${placeName}&key=${process.env.GEOCODE_API_KEY}`;
}

async function queryAPI(url){
  let apiResponseData;
  await axios
    .get(url)
    .then((response) => {
      if (response.data) {
        apiResponseData = response.data;
      }
    })
    .catch((err) => {
      apiResponseData = err.response.data;
    });
  return apiResponseData;
}

module.exports = router;
