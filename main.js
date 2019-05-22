// NOTE: initially, I couldn't quite wrap my head around selecting the input of a button-click-linked friend 
// [It should be noted I was quite sick while I was at this point]
// instead, for now, I've just rendered the inputted zip code to the DOM and selected it as a saved value for early work 
// since I know once I had data returning correctly I could come back to that part and figure it out
// my main concern was making the zip code dynamic, which proved a challenge as I was building out this part of the challenge.
// function saveUserZip() {
//     const userZip = document
//         .getElementById('zipcode')
//         .value;
//     const printZip = document
//         .getElementById("tempforski")
//         .innerHTML = userZip;
//     return (printZip);
// }
// console.log('printZip before returnConditions', printZip);

// NOTE: make API call, deliver temperature and stats, and rating of outdoor activity viability. 
// checkConditions in theory will check that the temperature is between a certain range I want to make the API request only on .click on the checkConditions so that the API returns the temperature, talks to my functions, and returns the correct condition report.

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

    // NOTE: here I noticed that when I sent this request to Postman I got back a
    // different object using: http://api.aerisapi.com/observations/55406?client_id=RPWkCaESX2v8UsgEhZSu8ient_secret=NIKctIWAkkEvTHWQsELj51e32qonWWGVS0DZ7OV5 // so that got me curious about where this object with the observation was coming back. 
    // I realized that the 'ob' object was actually just part of the larger object that gets
    // returned, ob and place. 
    // So rather than setting 'ob' as const ob, I just started my query higher up in the object and set result.data as my primary source of truth.

    request.get().then((result) => {
        console.log('result.data:', result.data);
        if (result.data) {
            const html = (`
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
               `);
            target.innerHTML = html;
        } // if(result.data) close
    }); //.then close

    // NOTE: Well, knowing the current conditions is all well and dandy, but what if I need to wax skis and travel? I might need to know what the conditions are in Wisconsin, or Oregon, or the Iron Range. My location doesn't help me there, so let's add a forecast so that I can see what the predictions are for the location of my race:
    requestForecast.get().then((result) => {
        const data = result.data;
        const {
            periods
        } = data[0];
        if (periods) {
            periods.reverse().forEach(period => {
                const date = new Date(period.dateTimeISO);
                const icon = `https://cdn.aerisapi.com/wxblox/icons/${period.icon || 'na.png'}`;
                const maxTempF = period.maxTempF || 'N/A';
                const minTempF = period.minTempF || 'N/A';
                const weather = period.weatherPrimary || 'N/A';

                const html = (`
                    <div class="card">
                        <div class="card-body">
                            <p class="title">${aeris.utils.dates.format(date, 'dddd')}</p>
                            <p><img class="icon" src="${icon}"></p>
                            <p class="wx">${weather}</p>
                            <p class="temps"><span>High:</span>${maxTempF} <span>Low:</span>${minTempF}</p>
                        </div>
                    </div>
                `);
                targetForecast.insertAdjacentHTML('afterbegin', html);
            });
        }
    });
}; // returnConditions();

// NOTE: So now that I was getting back the information that I wanted and a forecast for any* location of my choosing, now I want to know just how miserable I'll be on my ski. This is an elaborated version of Waxxer 1.0, where I simply passed in a numeric temperature and returned a color based on a number of wax charts I found online from Swix, START, and Toko, three major wax makers.
function moraleAfterSki() {
    // const tempOuter = document.getElementById('tempF');
    // console.log('tempOuter:', tempOuter);
    const temp = document.getElementById('tempF').innerText;
    // console.log('tempF:', temp);

    if (temp >= 51) {
        document
            .getElementById("tempforski")
            .innerHTML = "<span class='wax-color'>1: At this point, you'll have better luck putting on your <span class='wax-waterskis'>water skis</span> than your nordic skis.</span>";
        console.log(temp, "waterskis")
    } else if (temp >= 40 && temp <= 50) {
        document
            .getElementById("tempforski")
            .innerHTML = "<span class='wax-color'>2: It's unlikely you'll have a good time in temperatures this warm, but you do you. <span class='wax-red'>Use red wax!</span></span>";
        console.log(temp, "red");
    } else if (temp >= 33 && temp <= 39) {
        document
            .getElementById("tempforski")
            .innerHTML = "<span class='wax-color'>3: It's on the warmer side, but if it's cloudy or has been snowing it's probably fine. <span class='wax-violet'>Use violet wax!</span></span>";
        console.log(temp, " violet ");
    } else if (temp >= 26 && temp <= 32) {
        document
            .getElementById("tempforski")
            .innerHTML = "<span class='wax-color'>4: It's probably near-perfect conditions, not so cold as to make the snow slow, but not so war, as to make it slow. <span class='wax-blue'>Use blue wax!</span></span>";
        console.log(temp, "blue");
    } else if (temp >= 10 && temp <= 25) {
        document
            .getElementById("tempforski")
            .innerHTML = "<span class='wax-color'>5: It's a beautiful day for a ski! The conditions are likely beautiful! Happy trails! <span class='wax-green'>Use green wax!</span></span>";
        console.log(temp, "green");
    } else if (temp >= -20 && temp <= 9) {
        document
            .getElementById("tempforski")
            .innerHTML = "<span class='wax-color'>6: The temperature is between 0&deg;F and -20&deg;F - it's very cold! Bundle up and watch out for frostbite! <span class='wax-polar'>Use polar wax.</span></span>";
        console.log(temp, " polar ");
    };
} // moraleAfterSki() close

// HERE: original wax color function - big ol if/else!
// function returnWaxColor() {
//     var wax = document.getElementById('zipcode').value;
//     if (wax > 61) {
//         document.getElementById("wax-color-div").innerHTML = "waterskis";
//         console.log(wax, "waterskis")
//     } else if (wax > 34 && wax <
//         60) {
//         document.getElementById("wax-color-div").innerHTML =
//             "red";
//         console.log(wax, "red");
//     } else if (wax > 30 && wax < 33) {
//         document.getElementById("wax-color-div").innerHTML = "violet";
//         console.log(wax, "violet");
//     } else if (wax > 15 && wax < 29) {
//         document
//             .getElementById("wax-color-div").innerHTML = "blue";
//         console.log(wax, "blue");
//     } else if (wax > -3 && wax < 14) {
//         document
//             .getElementById("wax-color-div").innerHTML = "green";
//         console.log(wax, "green");
//     } else if (wax > -22 && wax < -4) {
//         document
//             .getElementById("wax-color-div").innerHTML = "polar";
//         console.log(wax, "polar");
//     };
//    returnWaxColor; 
//  }