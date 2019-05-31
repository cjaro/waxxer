function returnConditions() {
    // console.log('returnConditions(printZip)', printZip); const printZip =
    // document.getElementById("tempforski").innerHTML = userZip;
    const target = document.getElementById('conditions');
    const targetForecast = document.getElementById('forecast');
    // TODO: abstract to ignored file and export/import for privacy
    const aeris = new AerisWeather('RPWkCaESX2v8UsgEhZSu8', 'NIKctIWAkkEvTHWQsELj51e32qonWWGVS0DZ7OV5');
    const request = aeris
        .api()
        .endpoint('observations')
        .place(document.getElementById('zipcode').value);
    const requestForecast = aeris
        .api()
        .endpoint('forecasts')
        .place(document.getElementById('zipcode').value)
        .limit(5);

    request
        .get()
        .then((result) => {
            console.log('result.data:', result.data);
            if (result.data) {
                const html = (`
            <div class="scale-div">
            <span class="scale-span">On a scale of 1 (awful) to 6 (awesome), how good will ski conditions be?</span>
            <br>
            <button class="btn" onclick="moraleAfterSki();">Let's find out!</button>
            <br>
            <div class="skiMoraleDiv">
                <h4 id="tempforski"></h4>
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
                        <div>${result.data.ob.humidity || 'N/A'}%</div>
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
            } // if(result.data) close
        }); //.then close

    requestForecast
        .get()
        .then((result) => {
            const data = result.data;
            const { periods } = data[0];
            if (periods) {
                periods
                    .reverse()
                    .forEach(period => {
                        const date = new Date(period.dateTimeISO);
                        const icon = `https://cdn.aerisapi.com/wxblox/icons/${period.icon || 'na.png'}`;
                        const maxTempF = period.maxTempF || 'N/A';
                        const minTempF = period.minTempF || 'N/A';
                        const maxTempC = period.maxTempC || 'N/A';
                        const minTempC = period.minTempC || 'N/A';
                        const weather = period.weatherPrimary || 'N/A';

                        const html = (`
                    <div class="card">
                        <div class="card-body">
                            <p class="title">${aeris.utils.dates.format(date, 'dddd')}</p>
                            <p><img class="icon" src="${icon}"></p>
                            <p class="wx">${weather}</p>
                            <p class="temps"><span>High:</span>${maxTempF}ºF (${maxTempC}ºC)<br> <span>Low:</span>${minTempF}ºF (${minTempC}ºC)</p>
                        </div>
                    </div>
                `);
                        targetForecast.insertAdjacentHTML('afterbegin', html);
                    });
            }
        });
}; // returnConditions();

function moraleAfterSki() {

    const temp = document
        .getElementById('tempF')
        .innerText;
    // console.log('tempF:', temp);

    if (temp >= 51) {
        document
            .getElementById("tempforski")
            .innerHTML = "<div class='wax-color'><div class='wax-color-waterskis'><b>1</b></div><div class" +
            "='wax-waterskis'> Pull out your water skis!</div></div><div class='wax-comments'" +
            "> At this point, nordic skis won't cut it.</div>"
        console.log(temp, "waterskis")
    } else if (temp >= 40 && temp <= 50) {
        document
            .getElementById("tempforski")
            .innerHTML = "<div class='wax-color'><div class='wax-color-red'><b>2</b></div><div class='wax-" +
            "red' > Use red wax </div></div><div class='wax-comments'>It 's unlikely you'll h" +
            "ave a good time in temperatures this warm, but you do you.</div>";
        console.log(temp, "red");
    } else if (temp >= 33 && temp <= 39) {
        document
            .getElementById("tempforski")
            .innerHTML = "<div class='wax-color'><div class='wax-color-violet'><b>3</b></div><div class='w" +
            "ax wax-violet'>Use violet wax!</div></div><div class='wax-comments'>It's on the " +
            "warmer side, but if it's cloudy or has been snowing it's probably fine.</div> ";
        console.log(temp, " violet ");
    } else if (temp >= 26 && temp <= 32) {
        document
            .getElementById("tempforski")
            .innerHTML = "<div class='wax-color'><div class='wax-color-blue '><b>4</b></div><div class='wa" +
            "x wax-blue '>Use blue wax!</div></div><div class='wax-comments'>It's probably ne" +
            "ar-perfect conditions, not so c old as to make the snow slow, but not so warm as" +
            " to make it slow. </div>";
        console.log(temp, "blue");
    } else if (temp >= 10 && temp <= 25) {
        document
            .getElementById("tempforski")
            .innerHTML = "<div class='wax-color'><div class='wax-color-green'><b>5</b></div><div class='wa" +
            "x wax-green'>Use green wax!</div></div><div class='wax-comments'>It's a beautifu" +
            "l day for a ski! The conditions are likely beautiful! Happy trails!</div>";
        console.log(temp, "green");
    } else if (temp <= 9) {
        document
            .getElementById("tempforski")
            .innerHTML = "<div class='wax-color'><div class='wax-color-polar'><b>6</b></div><div class='wa" +
            "x wax-polar'>Use polar wax.</div></div><div class='wax-comments'>The temperature" +
            " is between 0&deg;F and -20&deg;F - it's very cold! Bundle up and watch out for " +
            "frostbite!</div>";
        console.log(temp, " polar ");
    };
} // moraleAfterSki() close

// HERE: original wax color function - big ol if/else! function returnWaxColor()
// {     var wax = document.getElementById('zipcode').value;     if (wax > 61)
// {         document.getElementById("wax-color-div").innerHTML = "waterskis";
// console.log(wax, "waterskis")     } else if (wax > 34 && wax < 60) {
// document.getElementById("wax-color-div").innerHTML =  "red"; console.log(wax,
// "red");     } else if (wax > 30 && wax < 33) {
// document.getElementById("wax-color-div").innerHTML = "violet";
// console.log(wax, "violet");     } else if (wax > 15 && wax < 29) { document
// .getElementById("wax-color-div").innerHTML = "blue"; console.log(wax,
// "blue");     } else if (wax > -3 && wax < 14) { document
// .getElementById("wax-color-div").innerHTML = "green"; console.log(wax,
// "green");     } else if (wax > -22 && wax < -4) {   document
// .getElementById("wax-color-div").innerHTML = "polar"; console.log(wax,
// "polar");     };    returnWaxColor;  }