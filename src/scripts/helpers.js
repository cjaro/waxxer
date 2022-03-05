module.exports = {
  formatWeatherData: function(weatherInfo, stateAndCountyInfo, mapUrl) {
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
        "windDirection": this.interpretWindDegrees(weatherInfo.wind.deg),
        "cloudCover": weatherInfo.clouds.all
      },
      "temps": {
        "currentTempC": (weatherInfo.main.temp - 273.15).toFixed(1),
        "currentTempF": ((weatherInfo.main.temp - 273.15) * (9/5) + 32).toFixed(1),
        "tempHighC": (weatherInfo.main.temp_max - 273.15).toFixed(1),
        "tempHighF": ((weatherInfo.main.temp_max - 273.15) * (9/5) + 32).toFixed(1),
        "tempLowC": (weatherInfo.main.temp_min - 273.15).toFixed(1),
        "tempLowF": ((weatherInfo.main.temp_min - 273.15) * (9/5) + 32).toFixed(1),
        "feelsLikeC": (weatherInfo.main.feels_like - 273.15).toFixed(1),
        "feelsLikeF": ((weatherInfo.main.feels_like - 273.15) * (9/5) + 32).toFixed(1)
      },
      "sunrise": new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString("en-US"),
      "sunset": new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString("en-US"),
      "currentTime": new Date(weatherInfo.dt * 1000).toLocaleTimeString("en-US"),
      "mapUrl": mapUrl,
      "waxColor": this.recommendWax((weatherInfo.main.temp - 273.15).toFixed(1))
    };
  },

  formatForecastData: function(incomingForecast) {
    return {
      "date": new Date(incomingForecast.dt * 1000).toDateString(),
      "time": new Date(incomingForecast.dt * 1000).toLocaleTimeString("en-US"),
      "dateText": incomingForecast.dt_txt,
      "main": {
        "tempF": ((incomingForecast.main.temp - 273.15) * (9/5) + 32).toFixed(1),
        "tempC": (incomingForecast.main.temp - 273.15).toFixed(1),
        "feelsLikeC": (incomingForecast.main.feels_like - 273.15).toFixed(1),
        "feelsLikeF": ((incomingForecast.main.feels_like - 273.15) * (9/5) + 32).toFixed(1),
        "humidity": incomingForecast.main.humidity
      },
      "weather": [
        {
          "id": incomingForecast.weather[0].id,
          "main": incomingForecast.weather[0].main,
          "description": incomingForecast.weather[0].description,
          "icon": incomingForecast.weather[0].icon
        }
      ],
      "clouds": incomingForecast.clouds.all,
      "wind": {
        "speed": incomingForecast.wind.speed,
        "degrees": incomingForecast.wind.deg,
        "direction": this.interpretWindDegrees(incomingForecast.wind.deg),
        "gust": incomingForecast.wind.gust
      }
    };
  },

  buildForecastObject: function(forecast) {
    let fullForecast = [];
    for (let i = 0; i < forecast.length; i++) {
      let newForecastObject = this.formatForecastData(forecast[i]);
      fullForecast.push(newForecastObject);
    }
    return fullForecast;
  },

  // for any given weather/icon set, you have these properties:
  // { "id": 804, "main": "Clouds", "description": "overcast clouds", "icon": "04d" }
  // so I want to assign the condition a new icon stitched together with the id & icon
  // e.g., "Clouds" = "80404d" & corresponding icon => static/assets/icons/80404d.png
  changeWeatherCode: function(iconCode) {},

  // http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
  // Looks horrific but someone else did the math: https://stackoverflow.com/questions/6665997/
  interpretWindDegrees: function(degrees) {
    if (348.75 <= degrees < 360) {
      return "N";
    } else if (0 <= degrees < 11.25) {
      return "N";
    } else if (11.25 <= degrees < 33.75) {
      return "NNE";
    } else if (33.75 <= degrees < 56.25) {
      return "NE";
    } else if (56.25 <= degrees < 78.75) {
      return "ENE";
    } else if (78.75 <= degrees < 101.25) {
      return "E";
    } else if (101.25 <= degrees < 123.75) {
      return "ESE";
    } else if (123.75 <= degrees < 146.25) {
      return "SE";
    } else if (146.25 <= degrees < 168.75) {
      return "SSE";
    } else if (168.75 <= degrees < 191.25) {
      return "S";
    } else if (191.25 <= degrees < 213.75) {
      return "SSW";
    } else if (213.75 <= degrees < 236.25) {
      return "SW";
    } else if (236.25 <= degrees < 258.75) {
      return "WSW";
    } else if (258.75 <= degrees < 281.25) {
      return "W";
    } else if (281.25 <= degrees < 303.75) {
      return "WNW";
    } else if (303.75 <= degrees < 326.25) {
      return "NW";
    } else if (326.25 <= degrees < 348.75) {
      return "NNW";
    }
  },

  // Wax recommendation based on all of these factors (temp, humidity, snowfall... how???)
  // aggregate data, not predictions. regression? R or Python could handle this
  recommendWax: function(tempCelsius) {
    if (tempCelsius >= 10.56) {
      return ["magenta", "Use water skis lmao ✌️."];
    }
    if (tempCelsius >= 4.00 && tempCelsius <= 10) {
      return ["red", "Use red wax. ❤️️"];
    }
    if (tempCelsius >= 0.10 && tempCelsius <= 3.99) {
      return ["violet", "Use violet wax. 💜"];
    }
    if (tempCelsius >= -3.33 && tempCelsius <= 0) {
      return ["blue", "Use blue wax. 💙"];
    }
    if (tempCelsius >= -12.22 && tempCelsius <= -3.34) {
      return ["green", "Use green wax. 💚"];
    }
    if (tempCelsius <= -12.23) {
      return ["aquamarine", "Use polar wax. ❄️"];
    }
  },

  // state/county info not always in the same index in the Google API response
  getStateAndCounty: function(geoCodeData) {
    let stateAndCounty = {};
    for (let i = 0; i < geoCodeData.length; i++) {
      if (geoCodeData[i].types[0] === "administrative_area_level_1") {
        stateAndCounty.stateAbbr = geoCodeData[i].short_name;
        stateAndCounty.stateLongName = geoCodeData[i].long_name;
      }
      if (geoCodeData[i].types[0] === "administrative_area_level_2") {
        stateAndCounty.county = geoCodeData[i].long_name;
      }
    }
    return stateAndCounty;
  },

  constructGeoCodeUrl: function(placeName) {
    return `${process.env.GEOCODE_BASE_URL}?address=${placeName}&key=${process.env.GEOCODE_API_KEY}`;
  },

  constructMapUrl: function(location, latitude, longitude){
    return `https://www.google.com/maps/place/${location}/@${latitude},${longitude},12z/`
  },

  queryAPI: async function(url) {
    const axios = require("axios");
    let apiResponseData;
    await axios
      .get(url)
      .then((response) => {
        if (response.data) {
          apiResponseData = response.data;
        }
      })
      .catch((err) => {
        apiResponseData = err;
      });
    return apiResponseData;
  },

  performAllTheCalls: async function(location, url, apiKey) {
    try {
      const geoCodeUrl = this.constructGeoCodeUrl(location);
      const geoCodeApiData = await this.queryAPI(geoCodeUrl);
      const stateAndCountyInfo = this.getStateAndCounty(geoCodeApiData.results[0].address_components);
      const lat = geoCodeApiData.results[0].geometry.location.lat;
      const long = geoCodeApiData.results[0].geometry.location.lng;
      const mapUrl = this.constructMapUrl(location, lat, long);
      const currentConditions = await this.queryAPI(`${url}/weather?lat=${lat}&lon=${long}&appid=${apiKey}`);
      const getForecast = await this.queryAPI(`${url}/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`);
      const forecast = this.buildForecastObject(getForecast.list);
      const formattedWeather = this.formatWeatherData(currentConditions, stateAndCountyInfo, mapUrl);

      return [formattedWeather, forecast];
    } catch (e) {
      console.log(e);
    }
  }
};
