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
        "iconCode": weatherInfo.weather[0].icon,
        "iconCode2": weatherInfo.weather[0].id + weatherInfo.weather[0].icon,
        "condition": weatherInfo.weather[0].main,
        "conditionDescription": weatherInfo.weather[0].description,
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
      "date": new Date(weatherInfo.dt * 1000),
      "mapUrl": mapUrl,
      "waxColor": this.recommendWax((weatherInfo.main.temp - 273.15).toFixed(1))
    };
  },

  formatForecastData: function(incomingForecast) {
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
        "humidity": incomingForecast.main.humidity
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
  // e.g., "Clouds" = "80404d" & corresponding icon => public/assets/icons/80404d.png
  changeWeatherCode: function(id, iconCode) {
    return `${id+iconCode}.png`;
  },

  // http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
  // Looks horrific but someone else did the math: https://stackoverflow.com/questions/6665997/
  interpretWindDegrees: function(degrees) {
    if (degrees < 360 && degrees >= 348.75) {
      return "N";
    } else if (degrees < 11.25 && degrees >= 0) {
      return "N";
    } else if (degrees < 33.75 && degrees >= 11.25) {
      return "NNE";
    } else if (degrees < 56.25 && degrees >= 33.75) {
      return "NE";
    } else if (degrees < 78.75 && degrees >= 56.25) {
      return "ENE";
    } else if (degrees < 101.25 && degrees >= 78.75) {
      return "E";
    } else if (degrees < 123.75 && degrees >= 101.25) {
      return "ESE";
    } else if (degrees < 146.25 && degrees >= 123.75) {
      return "SE";
    } else if (degrees < 168.75 && degrees >= 146.25) {
      return "SSE";
    } else if (degrees < 191.25 && degrees >= 168.75) {
      return "S";
    } else if (degrees < 213.75 && degrees >= 191.25) {
      return "SSW";
    } else if (degrees < 236.25 && degrees >= 213.75) {
      return "SW";
    } else if (degrees < 258.75 && degrees >= 236.25) {
      return "WSW";
    } else if (degrees < 281.25 && degrees >= 258.75) {
      return "W";
    } else if (degrees < 303.75 && degrees >= 281.25) {
      return "WNW";
    } else if (degrees < 326.25 && degrees >= 303.75) {
      return "NW";
    } else if (degrees < 348.75 && degrees >= 326.25) {
      return "NNW";
    }
  },

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

  isThereSnow: function(snowObject){
    let returnedSnowObject = {};

    if (snowObject["1h"]) { returnedSnowObject.snow1hr = snowObject["1h"]; }
    if (snowObject["3h"]) { returnedSnowObject.snow3hr = snowObject["3h"]; }

    return returnedSnowObject;
  },

  constructGeoCodeUrl: function(placeName, geoCodeURl, geoCodeApiKey) {
    return `${geoCodeURl}?address=${placeName}&key=${geoCodeApiKey}`;
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

  latLong: function (coord) {
    return [coord.lat, coord.lng];
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
  },

  returnLatLongStateCounty: async function(loc, geoCodeApiUrl, geoCodeApiKey) {
    try {
      const geoCodeUrl = this.constructGeoCodeUrl(loc, geoCodeApiUrl, geoCodeApiKey);
      const geoCodeApiData = await this.queryAPI(geoCodeUrl);
      const stateAndCountyInfo = this.getStateAndCounty(geoCodeApiData.results[0].address_components);
      const [latitude, longitude] = this.latLong(geoCodeApiData.results[0].geometry.location);
      const mapUrl = this.constructMapUrl(loc, latitude, longitude);

      return [
        stateAndCountyInfo,
        [latitude, longitude],
        mapUrl
      ];
    } catch(e) {
      console.error(e);
    }
  },

  gatherCurrentAndForecast: async function(location) {
    try {
      const appId = process.env.OPENWEATHERMAP_API_KEY;
      const weatherApiUrl = process.env.OPENWEATHERMAP_BASE_URL;
      const geoCodeApiUrl = process.env.GEOCODE_BASE_URL;
      const geoCodeApiKey = process.env.GEOCODE_API_KEY;

      const geo = await this.returnLatLongStateCounty(location, geoCodeApiUrl, geoCodeApiKey);
      const forecast = await this.queryAPI(`${weatherApiUrl}/forecast?lat=${geo[1][0]}&lon=${geo[1][1]}&appid=${appId}`);
      const weather = await this.queryAPI(`${weatherApiUrl}/weather?lat=${geo[1][0]}&lon=${geo[1][1]}&appid=${appId}`);

      const forecastDataObject = this.buildForecastObject(forecast.list);
      const groupForecastByDate = this.groupByDay(forecastDataObject);

      return [
        this.formatWeatherData(weather, geo[0], geo[2], geo[3]),
        groupForecastByDate
      ];
    } catch (e) {
      console.log(e);
    }
  }
};
