# Waxxer

As a cross country skier, it can be frustrating and confusing to prepare your skis for snow conditions: temperature, 
humidity, forecast, snowfall and more all factor into what kind of ski wax you'll need to put on the base of your skis. 
So what's a skier to do? All the commonly-used wax companies ([Swix](https://www.swixsport.com/en/ski-wax/), 
[Toko](https://tokous.com/), [Briko Maplus](https://brikomaplus.de/en/skiwachs/experts-order/), 
[StartWax](http://startskiwax.com/en/waxing-info), [ZumWax](https://www.zumwax.com/)) have their own charts and 
calculators, but the most accurate estimates for local conditions can be variable and relies on local ski shop 
information, historical race wax data & conditions, and experience waxing for the conditions over time.

Say hello to Waxxer! While talking with my partner/ski buddy this winter, I had the idea to create a wax-where-you-are 
application to give the best, most accurate weather conditions for XC ski races using a weather (current conditions & 
forecasting) API.

[Waxxer Live ↗︎](https://waxxer.herokuapp.com/weather)

## Getting Started

- Clone this project: `git clone git@github.com:cjaro/waxxer.git waxxer-clone`
- Run `npm install` at the root of the project.
- Copy `sample.env` and populate API keys:
  - [OpenWeatherMap](https://openweathermap.org/api)
  - [Google GeoCode API](https://developers.google.com/maps/documentation/geocoding)
- Run `npm start` to spin up the npm web server
- Head to http://localhost:3000/ to view the application.
