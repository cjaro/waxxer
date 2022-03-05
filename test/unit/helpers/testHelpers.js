require("dotenv").config();
const assert = require("assert");

const { constructGeoCodeUrl } = require("../../../src/scripts/helpers");

describe("testHelpers", () => {

  it("shouldTestFormatWeatherData", () => {
    const weatherInfo = "../fixtures/testMinneapolisApiResponse.json";

  });

  it("shouldConstructGeoCodeUrl", () => {
    const url = constructGeoCodeUrl("Duluth, MN");
    assert.equal(url, `${process.env.GEOCODE_BASE_URL}?address=Duluth, MN&key=${process.env.GEOCODE_API_KEY}`);
  });

});
