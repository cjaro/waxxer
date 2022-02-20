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
  const geoCodeData = await queryAPI(geoCodeUrl);

  const geoCodeState = geoCodeData.results[0].address_components[2].short_name;
  const geocodeCounty = geoCodeData.results[0].address_components[1].long_name;
  const geoCodeLat = geoCodeData.results[0].geometry.location.lat;
  const geoCodeLng = geoCodeData.results[0].geometry.location.lng;

  res.latitude = geoCodeLat;
  res.longitude = geoCodeLng;

  let openWeatherReqUrl = `${baseUrl}?lat=${geoCodeLat}&lon=${geoCodeLng}&appid=${openWeatherMapApiKey}`;

  try {
    console.log(`Fetching the weather for ${geoCodeLat}, ${geoCodeLng}`);

    axios
      .get(openWeatherReqUrl)
      .then(result => {
        console.log(result.data);
        let formattedWeather = formatWeatherData(result.data, geoCodeState, geocodeCounty);

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


function formatWeatherData(incomingJson, state, county) {
  let weatherArray = {
    "location": {},
    "conditions": {},
    "temps": {}
  };

  weatherArray["location"]["name"] = incomingJson.name;
  weatherArray["location"]["state"] = state;
  weatherArray["location"]["county"] = county;
  weatherArray["location"]["country"] = incomingJson.sys.country;
  weatherArray["location"]["latitude"] = incomingJson.coord.lat;
  weatherArray["location"]["longitude"] = incomingJson.coord.lon;

  weatherArray["conditions"]["openWeatherMapId"] = incomingJson.weather[0].id;
  weatherArray["conditions"]["condition"] = incomingJson.weather[0].main;
  weatherArray["conditions"]["conditionDescription"] = incomingJson.weather[0].description;
  weatherArray["conditions"]["iconCode"] = incomingJson.weather[0].icon;

  weatherArray["temps"]["currentTempC"] = (incomingJson.main.temp - 273.15).toFixed(1);
  weatherArray["temps"]["currentTempF"] = ((incomingJson.main.temp - 273.15) * 9/5 + 32).toFixed(1);
  weatherArray["temps"]["tempHighC"] = (incomingJson.main.temp_max - 273.15).toFixed(1);
  weatherArray["temps"]["tempHighF"] = ((incomingJson.main.temp_max - 273.15) * 9/5 + 32).toFixed(1);
  weatherArray["temps"]["tempLowC"] = (incomingJson.main.temp_min - 273.15).toFixed(1);
  weatherArray["temps"]["tempLowF"] = ((incomingJson.main.temp_min - 273.15) * 9/5 + 32).toFixed(1);
  weatherArray["temps"]["feelsLikeC"] = (incomingJson.main.feels_like - 273.15).toFixed(1);
  weatherArray["temps"]["feelsLikeF"] = ((incomingJson.main.feels_like - 273.15) * 9/5 + 32).toFixed(1);

  weatherArray["currentTime"] = new Date(incomingJson.dt * 1000).toLocaleTimeString("en-US");
  weatherArray["sunrise"] = new Date(incomingJson.sys.sunrise * 1000).toLocaleTimeString("en-US");
  weatherArray["sunset"] = new Date(incomingJson.sys.sunset * 1000).toLocaleTimeString("en-US");

  weatherArray["humidity"] = incomingJson.main.humidity;
  weatherArray["pressure"] = incomingJson.main.pressure;
  weatherArray["windSpeed"] = incomingJson.wind.speed;
  weatherArray["cloudCover"] = incomingJson.clouds.all;

  console.log(weatherArray);

  return weatherArray;
}

function changeWeatherCode(iconCode) {}

function recommendWax(tempCelsius, humidity, condition, conditionDescription) {
  // cobble together a wax recommendation, given temperature, humidity, snowfall, and general conditions
}

function constructGeoCodeUrl(placeName) {
  const geoCodeUrl = `${process.env.GEOCODE_BASE_URL}?address=${placeName}&key=${process.env.GEOCODE_API_KEY}`;
  console.log(geoCodeUrl);
  return `${process.env.GEOCODE_BASE_URL}?address=${placeName}&key=${process.env.GEOCODE_API_KEY}`;
}

async function queryAPI(url){
  let apiResponseData;
  await axios
    .get(url)
    .then((response) => {
      if (response.data) {
        apiResponseData = response.data;
        console.log(apiResponseData);
      }
    })
    .catch((err) => {
      console.error('Error:', err.response.data.errors);
      apiResponseData = err.response.data;
    });
  return apiResponseData;
}

module.exports = router;
