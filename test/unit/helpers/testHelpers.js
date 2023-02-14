const assert = require("assert");

const { constructGeoCodeUrl, interpretWindDegrees, groupByDay } = require("../../../src/scripts/helpers");
const { minneapolisFiveDayForecast } = import("../../fixtures/minneapolis5DayForecast.json");

describe("testHelpers", () => {

  it("shouldTestFormatWeatherData", () => {
    const weatherInfo = "../fixtures/testMinneapolisApiResponse.json";

  });

  it("shouldConstructGeoCodeUrl", () => {
    const url = constructGeoCodeUrl("Duluth, MN");
    let baseUrl = process.env.GEOCODE_BASE_URL;
    let apiKey = process.env.GEOCODE_API_KEY;
    assert.equal(url, `${baseUrl}?address=Duluth, MN&key=${apiKey}`);
  });

  it("shouldTestWindDegrees", () => {
    const degreeNums = [8, 30, 54, 75, 99, 120, 140, 155, 175, 210, 230, 250, 275, 295, 320, 340, 359];
    const degrees = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"]

    let testDirections = [];

    for (let i = 0; i < degreeNums.length; i++) {
      let calcWindDir = interpretWindDegrees(degreeNums[i]);
      testDirections.push(calcWindDir);
    }

    assert.deepEqual(degrees, testDirections);
  });


  it("shouldGroupForecastByDate", () => {
    const groupData = groupByDay(minneapolisFiveDayForecast);
    groupData.forEach(element => console.log(element))
  });

  it("should construct map url", () => {
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?lat=47.7504469&lon=-90.3342727&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    let constructQueryUrl = constructQueryUrl("weather", 47.7504469, -90.3342727)

    assert.deepEqual(testUrl, constructQueryUrl);
  })

});
