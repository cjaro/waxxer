const express = require('express');
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const placeName = process.argv;

  res.render("index", {
    title: "☀️ 🌧 Query the weather, wherever you're heading ❄️ 🌩",
  });
})

router.post('/weather', async function (req, res) {
  const openWeatherMapApiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = process.env.OPENWEATHERMAP_BASE_URL;

  const geoCodeUrl = constructGeoCodeUrl(req.body.placename);
  const geoCodeData = await queryAPI(geoCodeUrl);
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
        let weatherJson = result.data;
        let formattedWeather = formatWeatherData(result.data);

        res.render("weather", {
          title: "☀️ 🌧 Weather! ❄️ 🌩",
          weather: formattedWeather,
        });
      })
      .catch(error => {
        console.error(error);
      });
  } catch (error) {
    res.send(error.toString())
  }
});


function formatWeatherData(incomingJson) {
  let newWeatherArray = [];

  newWeatherArray["name"] = incomingJson.name;
  newWeatherArray["country"] = incomingJson.sys.country;
  newWeatherArray["latitude"] = incomingJson.coord.lat;
  newWeatherArray["longitude"] = incomingJson.coord.lon;
  newWeatherArray["condition"] = incomingJson.weather[0].main;
  newWeatherArray["conditionDescription"] = incomingJson.weather[0].description;
  newWeatherArray["currentTime"] = new Date(incomingJson.dt * 1000).toLocaleTimeString("en-US");
  newWeatherArray["sunrise"] = new Date(incomingJson.sys.sunrise * 1000).toLocaleTimeString("en-US");
  newWeatherArray["sunset"] = new Date(incomingJson.sys.sunset * 1000).toLocaleTimeString("en-US");
  newWeatherArray["currentTempC"] = (incomingJson.main.temp - 273.15).toFixed(1);
  newWeatherArray["currentTempF"] = ((incomingJson.main.temp - 273.15) * 9/5 + 32).toFixed(1);
  newWeatherArray["tempHighC"] = (incomingJson.main.temp_max - 273.15).toFixed(1);
  newWeatherArray["tempHighF"] = ((incomingJson.main.temp_max - 273.15) * 9/5 + 32).toFixed(1);
  newWeatherArray["tempLowC"] = (incomingJson.main.temp_min - 273.15).toFixed(1);
  newWeatherArray["tempLowF"] = ((incomingJson.main.temp_min - 273.15) * 9/5 + 32).toFixed(1);
  newWeatherArray["feelsLikeC"] = (incomingJson.main.feels_like - 273.15).toFixed(1);
  newWeatherArray["feelsLikeF"] = ((incomingJson.main.feels_like - 273.15) * 9/5 + 32).toFixed(1);
  newWeatherArray["humidity"] = incomingJson.main.humidity;
  newWeatherArray["pressure"] = incomingJson.main.pressure;
  newWeatherArray["windSpeed"] = incomingJson.wind.speed;
  newWeatherArray["cloudCover"] = incomingJson.clouds.all;
  newWeatherArray["iconCode"] = incomingJson.weather[0].icon;

  return newWeatherArray;
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
