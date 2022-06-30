module.exports = {
  formatWeatherData(weatherInfo, stateAndCountyInfo, mapUrl) {
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
        "iconCode": weatherInfo.weather[0].icon,
        "iconCode2": weatherInfo.weather[0].id + weatherInfo.weather[0].icon,
        "condition": weatherInfo.weather[0].main,
        "conditionDescription": weatherInfo.weather[0].description,
        "humidityPercentage": weatherInfo.main.humidity,
        "pressureMillibars": weatherInfo.main.pressure,
        "windSpeedMps": weatherInfo.wind.speed,
        "windDirection": this.interpretWindDegrees(weatherInfo.wind.deg),
        "cloudCoverPercentage": weatherInfo.clouds.all
      },
      "temps": {
        "currentTempC": (weatherInfo.main.temp - 273.15).toFixed(1),
        "currentTempF": ((weatherInfo.main.temp - 273.15) * (9/5) + 32).toFixed(1),
        "tempHiC": (weatherInfo.main.temp_max - 273.15).toFixed(1),
        "tempHiF": ((weatherInfo.main.temp_max - 273.15) * (9/5) + 32).toFixed(1),
        "tempLoC": (weatherInfo.main.temp_min - 273.15).toFixed(1),
        "tempLoF": ((weatherInfo.main.temp_min - 273.15) * (9/5) + 32).toFixed(1),
        "feelsLikeC": (weatherInfo.main.feels_like - 273.15).toFixed(1),
        "feelsLikeF": ((weatherInfo.main.feels_like - 273.15) * (9/5) + 32).toFixed(1)
      },
      "sunrise": new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString("en-US"),
      "sunset": new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString("en-US"),
      "currentTime": new Date(weatherInfo.dt * 1000).toLocaleTimeString("en-US"),
      "date": new Date(weatherInfo.dt * 1000),
      "mapUrl": mapUrl,
      "waxColor": this.recommendWax((weatherInfo.main.temp - 273.15).toFixed(1))
    };
  },

  formatForecastData(incomingForecast) {
    let isSnow = "No snow forecasted.";
    if (incomingForecast.snow) {
      isSnow = JSON.stringify(this.isThereSnow(incomingForecast.snow));
    }

    return {
      "date": new Date(incomingForecast.dt * 1000).toDateString(),
      "time": new Date(incomingForecast.dt * 1000).toTimeString(),
      "dateText": incomingForecast.dt_txt,
      "main": {
        "tempF": ((incomingForecast.main.temp - 273.15) * (9/5) + 32).toFixed(1),
        "tempC": (incomingForecast.main.temp - 273.15).toFixed(1),
        "feelsLikeC": (incomingForecast.main.feels_like - 273.15).toFixed(1),
        "feelsLikeF": ((incomingForecast.main.feels_like - 273.15) * (9/5) + 32).toFixed(1),
        "humidityPercentage": incomingForecast.main.humidity
      },
      "weather": {
        "id": incomingForecast.weather[0].id,
        "main": incomingForecast.weather[0].main,
        "description": incomingForecast.weather[0].description,
        "iconCode": incomingForecast.weather[0].icon,
        "iconCode2": incomingForecast.weather[0].id + incomingForecast.weather[0].icon
      },
      "snow": isSnow,
      "clouds": incomingForecast.clouds.all,
      "wind": {
        "speedMps": incomingForecast.wind.speed,
        "degrees": incomingForecast.wind.deg,
        "direction": this.interpretWindDegrees(incomingForecast.wind.deg),
        "gust": incomingForecast.wind.gust
      }
    };
  },

  buildForecastObject(forecast) {
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
  // e.g., "Clouds" = "80404d" & corresponding icon => public/assets/icons/80404d.png
  changeWeatherCode(id, iconCode) {
    return `${id+iconCode}.png`;
  },

  // http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
  // Looks horrific but someone did the math: https://stackoverflow.com/questions/6665997/
  interpretWindDegrees(deg) {
    if (deg < 360 && deg >= 348.75) {
      return "N";
    } else if (deg < 11.25 && deg >= 0) {
      return "N";
    } else if (deg < 33.75 && deg >= 11.25) {
      return "NNE";
    } else if (deg < 56.25 && deg >= 33.75) {
      return "NE";
    } else if (deg < 78.75 && deg >= 56.25) {
      return "ENE";
    } else if (deg < 101.25 && deg >= 78.75) {
      return "E";
    } else if (deg < 123.75 && deg >= 101.25) {
      return "ESE";
    } else if (deg < 146.25 && deg >= 123.75) {
      return "SE";
    } else if (deg < 168.75 && deg >= 146.25) {
      return "SSE";
    } else if (deg < 191.25 && deg >= 168.75) {
      return "S";
    } else if (deg < 213.75 && deg >= 191.25) {
      return "SSW";
    } else if (deg < 236.25 && deg >= 213.75) {
      return "SW";
    } else if (deg < 258.75 && deg >= 236.25) {
      return "WSW";
    } else if (deg < 281.25 && deg >= 258.75) {
      return "W";
    } else if (deg < 303.75 && deg >= 281.25) {
      return "WNW";
    } else if (deg < 326.25 && deg >= 303.75) {
      return "NW";
    } else if (deg < 348.75 && deg >= 326.25) {
      return "NNW";
    }
  },

  recommendWax(tempCelsius) {
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
  getStateAndCounty(geoCodeData) {
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

  isThereSnow(snowObject){
    let returnedSnowObject = {};

    if (snowObject["1h"]) { returnedSnowObject.snow1hr = snowObject["1h"]; }
    if (snowObject["3h"]) { returnedSnowObject.snow3hr = snowObject["3h"]; }

    return returnedSnowObject;
  },

  constructGeoCodeUrl(placeName, geoCodeURl, geoCodeApiKey) {
    return `${geoCodeURl}?address=${placeName}&key=${geoCodeApiKey}`;
  },

  constructMapUrl(location, latitude, longitude){
    return `https://www.google.com/maps/place/${location}/@${latitude},${longitude},12z/`
  },

  constructWeatherApiQueryUrl(weatherType, lat, lng) {
    const weatherApiUrl = process.env.OPENWEATHERMAP_BASE_URL;
    const appId = process.env.OPENWEATHERMAP_API_KEY;

    // https://api.openweathermap.org/data/2.5/weather?lat=47.7504469&lon=-90.3342727&appid=9f74149fdb7e65ed0d95e1fb19c0a823
    // /weather?lat=${lat}&lon=${long}&appid=${appId}`);
    return `${weatherApiUrl}/${weatherType}?lat=${lat}&lon=${lng}&appid=${appId}`
  },

  async queryAPI(url) {
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

  // https://stackoverflow.com/questions/46802448/
  groupByDay(forecastObject){
    const groups = forecastObject.reduce((groups, forecast) => {
      const fdate = forecast.date;
      if(!groups[fdate]) {
        groups[fdate] = [];
      }
      groups[fdate].push(forecast);
      return groups;
    }, {});

    return Object.keys(groups).map((date) => {
      return {
        date,
        forecasts: groups[date]
      };
    });
  }
};
