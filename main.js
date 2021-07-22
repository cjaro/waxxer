function returnConditions() {

  const target = document.getElementById('conditions');
  const targetForecast = document.getElementById('forecast');

  const aeris = new AerisWeather('RPWkCaESX2v8UsgEhZSu8', 'NIKctIWAkkEvTHWQsELj51e32qonWWGVS0DZ7OV5');
  const openWeatherMap =
  const request = aeris.api().endpoint('observations').place(document.getElementById('zipcode').value);
  const requestForecast = aeris.api().endpoint('forecasts').place(document.getElementById('zipcode').value).limit(5);

  request.get().then((result) => {
    console.log('result.data:', result.data);
    if (result.data) {
      const html = (`
            <div class="scale-div">
            <button class="btn" onclick="moraleAfterSki();">Let's find out!</button>
            <br>
            <div class="skiMoraleDiv">
                <div id="tempforski"></div>
            </div>
        </div>
        <hr class="waxxer-hr">
                <div class="cols">
                    <div>
                    <h3>Conditions in ${result.data.place.name.charAt(0).toUpperCase() + result.data.place.name.slice(1)}, ${result.data.place.state.toUpperCase()}</h3>
                    <p class="timestamp">at ${aeris.utils.dates.format(new Date(result.data.ob.timestamp * 1000), 'h:mm a on D MMM, YYYY')}</p>     
                    <div>
                            <img class="icon" src="https://cdn.aerisapi.com/wxblox/icons/${result.data.ob.icon || 'na.png'}">
                        </div>
                        <p class="wx">${result.data.ob.weatherPrimary}</p>
                    <div class="tempsFandC">
                        <p id="tempF" class="temp">${result.data.ob.tempF}</p><p class="temp">&deg;F</p>
                        <p class="temp">&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;</p>
                        <p id="tempC" class="temp">${result.data.ob.tempC}<p><p class="temp">&deg;C</p>
                    </div>
                </div>
                <div class="details">
                    <div class="row">
                        <div>Humidity</div>
                        <div>${result.data.ob.humidity}%</div>
                    </div>
                     <div class="row">
                        <div>Precipitation</div>
                        <div>${result.data.ob.precipMM}mm</div>
                    </div>
                    <div class="row">                                
                        <div>Windchill</div>
                            <div>${result.data.ob.windchillF}<span>&deg;F</span></div>
                    </div>
                    <div class="row">
                        <div>Winds</div>
                        <div>${result.data.ob.windSpeedMPH}</div>
                    </div>
                    <div class="row">
                        <div>Sunrise</div>
                        <div>${aeris.utils.dates.format(new Date(result.data.ob.sunriseISO), 'HH:mm')}</div>
                    </div>
                    <div class="row">
                        <div>Sunset</div>                            
                        <div>${aeris.utils.dates.format(new Date(result.data.ob.sunsetISO), 'HH:mm')}</div>
                    </div>
                </div>    
               
            </div>
            <div class="skiMoraleDiv">
              <h4>Do you have a race coming up? Be prepared!</h4>
                            
           `);
      target.innerHTML = html;
    }
  });

  requestForecast.get().then((result) => {
    const data = result.data;
    const {periods} = data[0];
    if (periods) {
      periods.reverse().forEach(period => {
        const date = new Date(period.dateTimeISO);
        const icon = `https://cdn.aerisapi.com/wxblox/icons/${period.icon || 'na.png'}`;
        const maxTempF = period.maxTempF || 'N/A';
        const minTempF = period.minTempF || 'N/A';
        const maxTempC = period.maxTempC || 'N/A';
        const minTempC = period.minTempC || 'N/A';
        const weather = period.weatherPrimary || 'N/A';
        const humidity = period.humidity || 'N/A';

        const html = (`
                    <div class="card">
                        <div class="card-body">
                            <p class="title">${aeris.utils.dates.format(date, 'dddd')}</p>
                            <p><img class="icon" src="${icon}"></p>
                            <p class="wx">${weather}</p>
                            <p class="temps"><span>High:</span>${maxTempF}ºF (${maxTempC}ºC)
                                <br> <span>Low:</span>${minTempF}ºF (${minTempC}ºC)
                                <br> <span>Humidity: ${humidity}</span>
                            </p>
                            <p></p>
                        </div>
                    </div>
                `);
        targetForecast.insertAdjacentHTML('afterbegin', html);
      });
    }
  });
}

function moraleAfterSki() {

  const temp = document.getElementById('tempF').innerText;

  if (temp >= 51) {
    document.getElementById("tempforski").innerHTML = "<div class='wax-color'><div class='wax-waterskis'> Pull out your water skis!</div></div><div class='wax-comments'>At this point, nordic skis won't cut it.</div>";
  } else if (temp >= 40 && temp <= 50) {
    document.getElementById("tempforski").innerHTML = "<div class='wax-color'><div class='wax-red' > Use red wax </div></div><div class='wax-comments'>It 's unlikely you'll have a good time in temperatures this warm, but you do you.</div>";
  } else if (temp >= 33 && temp <= 39) {
    document.getElementById("tempforski").innerHTML = "<div class='wax-color'></div><div class='wax wax-violet'>Use violet wax!</div></div><div class='wax-comments'>It's on the warmer side, but if it's cloudy or has been snowing it's probably fine.</div> ";
  } else if (temp >= 26 && temp <= 32) {
    document.getElementById("tempforski").innerHTML = "<div class='wax-color'><div class='wax wax-blue '>Use blue wax!</div></div><div class='wax-comments'>It's probably near-perfect conditions, not so c old as to make the snow slow, but not so warm as to make it slow. </div>";
  } else if (temp >= 10 && temp <= 25) {
    document.getElementById("tempforski").innerHTML = "<div class='wax-color'><div class='wax wax-green'>Use green wax!</div></div><div class='wax-comments'>It's a beautiful day for a ski! The conditions are likely beautiful! Happy trails!</div>";
  } else if (temp <= 9) {
    document.getElementById("tempforski").innerHTML = "<div class='wax-color'><div class='wax wax-polar'>Use polar wax.</div></div><div class='wax-comments'>The temperature is between 0&deg;F and -20&deg;F - it's very cold! Bundle up and watch out for frostbite!</div>";
  }
}
