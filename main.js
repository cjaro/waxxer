// TODO: make API call, deliver temperature and stats, and rating of outdoor activity viability. checkConditions in theory will check that the temperature is between a certain range I want to make the API request only on .click on the checkConditions so that the API returns the temperature, talks to my functions, and returns the correct condition report.

// TODO: initially, I couldn't quite wrap my head around selecting the input of a button-click-linked friend, so I just rendered the inputted zip code to the DOM and selected it as a saved value for early work since I know once I had data returning correctly I could come back to that part and figure it out as my main concern was making the zip code dynamic, which proved a challenge as I was building out this part of the challenge.
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

function returnConditions() {
    // console.log('returnConditions(printZip)', printZip); const printZip =
    // document.getElementById("tempforski").innerHTML = userZip;
    const target = document.getElementById('conditions');
    const aeris = new AerisWeather('RPWkCaESX2v8UsgEhZSu8', 'NIKctIWAkkEvTHWQsELj51e32qonWWGVS0DZ7OV5');
    const request = aeris
        .api()
        .endpoint('observations')
        .place(document.getElementById('zipcode').value);

    // TODO: here I noticed that when I sent this request to Postman I got back a
    // different object using:
    // http://api.aerisapi.com/observations/55406?client_id=RPWkCaESX2v8UsgEhZSu8&cl
    // ient_secret=NIKctIWAkkEvTHWQsELj51e32qonWWGVS0DZ7OV5 so that got me curious
    // about where this object with the observation was coming back. I realized that
    // the 'ob' object was actually just part of the larger object that gets
    // returned, ob and place. So rather than setting 'ob' as const ob, I just
    // started my query higher up in the object and set result.data as my primary
    // source of truth.

    request
        .get()
        .then((result) => {
            console.log('result.data:', result.data);
            if (result.data) {
                const html = (`
                    <div class="cols">
                        <div>
                        <h3>Conditions in ${result.data.place.name.charAt(0).toUpperCase() + result.data.place.name.slice(1)}, ${result.data.place.state.toUpperCase()}</h3>
                        <p class="timestamp">at ${aeris.utils.dates.format(new Date(result.data.ob.timestamp * 1000), 'h:mm a on D MMM, YYYY')}</p>     
                        <div class="tempsFandC">
                            <p id="tempF" class="temp">${result.data.ob.tempF}</p><span>&deg;F</span>
                            <span>&nbsp;</span>
                            <p id="tempC" class="temp">${result.data.ob.tempC}<p><span>&deg;C</span>
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
            }
            // }; // checkConditions();  
        }); //.then close
}; // returnConditions();

function moraleAfterSki() {
    const tempOuter = document.getElementById('tempF');
    console.log('tempOuter', tempOuter);
    const temp = document
        .getElementById('tempF').innerText;
    console.log('tempF', temp);

    if (temp >= 51) {
        document
            .getElementById("tempforski")
            .innerHTML = "1: At this point, you'll have better luck putting on your water skis than your nordic skis.";
        console.log(temp, "waterskis")
    } else if (temp >= 40 && temp <= 50) {
        document
            .getElementById("tempforski")
            .innerHTML = "2: It's unlikely you'll have a good time in temperatures this warm, but you do you. Use red wax!";
        console.log(temp, "red");
    } else if (temp >= 30 && temp <= 39) {
        document
            .getElementById("tempforski")
            .innerHTML = "3: It's on the warmer side, but if it's cloudy or has been pretty cold the last few days it's probably fine. Use violet wax!";
        console.log(temp, " violet ");
    } else if (temp >= 19 && temp <= 29) {
        document
            .getElementById("tempforski")
            .innerHTML = "4: It's probably perfect conditions, not so cold as to make the snow slow, but not so war, as to make it slow. Use blue wax!";
        console.log(temp, "blue");
    } else if (temp >= 1 && temp <= 18) {
        document
            .getElementById("tempforski")
            .innerHTML = "5: It's between 1&deg;F and 18&def;F and the conditions are likely beautiful! Happy trails! Use green wax!";
        console.log(temp, "green");
    } else if (temp >= -20 && temp <= 0) {
        document
            .getElementById("tempforski")
            .innerHTML = "6: The temperature is between 0&deg;F and -20&deg;F - it's very cold! Bundle up and watch out for frostbite! Use polar wax.";
        console.log(temp, " polar ");
    };
}


// TODO: original wax color function - big ol if/else!
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
//     }; // break returnWaxColor; } }; //request