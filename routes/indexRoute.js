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

        console.log(formattedWeather);

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
  return {
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
      "iconCode": weatherInfo.weather[0].icon,
      "humidity": weatherInfo.main.humidity,
      "pressure": weatherInfo.main.pressure,
      "windSpeed": weatherInfo.wind.speed,
      "windDirection": weatherInfo.wind.deg,
      "cloudCover": weatherInfo.clouds.all,
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
    "sunrise": new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString("en-US"),
    "sunset": new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString("en-US"),
    "currentTime": new Date(weatherInfo.dt * 1000).toLocaleTimeString("en-US"),
    "waxColor": recommendWax((weatherInfo.main.temp - 273.15).toFixed(1))
  };
}

function changeWeatherCode(iconCode) {}

function recommendWax(tempCelsius) {

  if (tempCelsius >= 10.56) {
    return "Grab your water skis! At this point, nordic skis won't cut it.";
  }
  if (tempCelsius >= 4.44 && tempCelsius <= 10) {
    return "Use red wax. It's warm - stay hydrated!.";
  }
  if (tempCelsius >= 0.56 && tempCelsius <= 3.89) {
    return "Use violet wax! It's on the warmer side, but if it's cloudy or has been snowing it's probably fine.";
  }
  if (tempCelsius >= -3.33 && tempCelsius <= 0) {
    return "Use blue wax! It's probably near-perfect conditions out there. Have fun!";
  }
  if (tempCelsius >= -12.22 && tempCelsius <= -3.89) {
    return "Use green wax! It's a beautiful day for a ski! The conditions are likely beautiful! Happy trails!";
  }
  if (tempCelsius <= -12.78) {
    return "Use polar wax. It's very cold - bundle up and watch out for frostbite!";
  }
}

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
