// window.onload = () => { 
// NOW: now we need to fire the rest of the actions:
// make API call, deliver temperature and stats, and rating of outdoor activity
// viability. checkConditions in theory will check that the temperature is
// between a certain range I want to make the API request only on .click on the
// checkConditions so that the API returns the temperature, talks to my
// functions, and returns the correct condition report.

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

    // so here I noticed that when I sent this request to Postman I got back a
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
                            <p class="timestamp">on ${aeris.utils.dates.format(new Date(result.data.ob.timestamp * 1000), 'h:mm a, MMM D, YYYY')}</p>     
                            <p class="wx">It's ${result.data.ob.weatherPrimary}</p>
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
                                <div>${result.data.ob.windSpeedMPH > 2
                    ? `${result.data.ob.windSpeedMPH} mph`
                    : `Calm`}</div>
                            </div>
                            <div class="row">
                            <div>Sunrise</div>
                                <div>${aeris.utils.dates.format(new Date(result.data.ob.sunriseISO), 'h:mm a, MMM D, YYYY')}</div>
                            </div>
                            <div class="row">
                            <div>Sunset</div>
                                <div>${aeris.utils.dates.format(new Date(result.data.ob.sunsetISO), 'h:mm a, MMM D, YYYY')}</div>
                            </div>
                        </div>
                        
                    </div>
               `);
                    target.innerHTML = html;

                    const temp = document
                        .getElementById('tempF')
                        .value;
                    // console.log('tempF', temp);

                    console.log('tempF.value', temp.value);
                    if (temp > 61) {
                        document
                            .getElementById("tempforski")
                            .innerHTML = "1 - conditions will be horrible ";
                        console.log(temp, " waterskis ")
                    } else if (temp > 34 && temp < 60) {
                        document
                            .getElementById("tempforski")
                            .innerHTML = "2 - conditions likely will be subpar ";
                        console.log(temp, " red ");
                    } else if (temp > 30 && temp < 33) {
                        document
                            .getElementById("tempforski")
                            .innerHTML = "3 - conditions likely will be fair ";
                        console.log(temp, " violet ");
                    } else if (temp > 15 && temp < 29) {
                        document
                            .getElementById("tempforski")
                            .innerHTML = "4 - conditions likely will be good";
                        console.log(temp, "blue");
                    } else if (temp > -3 && temp < 14) {
                        document
                            .getElementById("tempforski")
                            .innerHTML = "5 - conditions will be great, happy trails!";
                        console.log(temp, "green");
                    } else if (temp > -22 && temp < -4) {
                        document
                            .getElementById("tempforski")
                            .innerHTML = "6 - bundle up !";
                        console.log(temp, " polar ");
                    };

                }
                // }; //checkConditions close  
                //here, I want to wrap the APi call in a function in order to fire only after the user has given us a zipcode or location to make the request.
                function returnWaxColor() {
                    var wax = document.getElementById('zipcode').value;
                    if (wax > 61) {
                        document.getElementById("wax-color-div").innerHTML = "waterskis";
                        console.log(wax, "waterskis")
                    } else if (wax > 34 && wax <
                        60) {
                        document.getElementById("wax-color-div").innerHTML =
                            "red";
                        console.log(wax, "red");
                    } else if (wax > 30 && wax < 33) {
                        document.getElementById("wax-color-div").innerHTML = "violet";
                        console.log(wax, "violet");
                    } else if (wax > 15 && wax < 29) {
                        document
                            .getElementById("wax-color-div").innerHTML = "blue";
                        console.log(wax, "blue");
                    } else if (wax > -3 && wax < 14) {
                        document
                            .getElementById("wax-color-div").innerHTML = "green";
                        console.log(wax, "green");
                    } else if (wax > -22 && wax < -4) {
                        document
                            .getElementById("wax-color-div").innerHTML = "polar";
                        console.log(wax, "polar");
                    }; // break returnWaxColor; } }; //request
                });
        }; //window.load