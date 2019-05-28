# The Challenge
We would like you to complete a small coding challenge as part of your interview process. This is an at-home challenge to avoid the pitfalls of having to use a whiteboard or live code in a potentially stressful situation in our office. Ideally the challenge is enjoyable and doesn’t take too long (just a few hours, max) as we want to be respectful of your time.

We request you implement a program to create a “weather index” for an outdoor hobby of your choosing. Your program will need to accept a user’s location and return a 1-5 rating of whether it would be terrible or great for doing your activity presently. We already have several weather indices in our API that you may reference in our documentation. There is no need for your program to support all of the features (actions, parameters, filters, etc.) that our API supports, but do reference that documentation page to see how a user’s request for an index may get turned into a response.

# CJ's Documentation:
* I started by reading through the ‘Getting Started’ for the JavaScript SDK for implementation into Waxxer, a tool I built over the winter when conditions for Nordic skiing were unpredictable. Temperature, humidity, snow type, and forecast all factor into choosing a wax for the bottom of your skis, so I thought it would be nice.
* Module or Script-based approach? Initially I thought using the modular approach would be the way forward but as I began to integrate the API, as I was reading more about each path, it seemed that for a small, lightweight instance like waxxer, the script might be the way to go. 
* However, we are all but simple humans at the end of the day and I am no different. Being enthusiastic about this job and company, I signed up for an account a while ago, but was diverted from the sign up for a subscription page and I spent about an hour seeing various 403’s no matter what I entered as my GET and my key/secret. So I hadn’t initialised the waxxer application but had instead initialised a different application I’d registered. Whoops.
* Tl;dr: I’m stupid, but never for very long.
* So, now that I’m putting my stupid brain back on the shelf, I fire up Postman and get my request returning the right info with my id, secret, and a zip code in the get request, I brainstorm.
* Ideally, I’d like to be able to pass a user inputted location (city, zip code, etc) and return an array of information. I can see that it's possible based on the Examples here [https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/examples/display-an-observation/] so I know if I can get something like that up and running we'll be in rare form.
* **Test ZIPs: 55344, 99723, 32901**

### returnConditions() 
* Line 1 - // NOTE: initially, I couldn't quite wrap my head around selecting the input of a button-click-linked friend [It should be noted I was quite sick while I was at this point] Instead, for now, I've just rendered the inputted zip code to the DOM and selected it as a saved value for early work since I know once I had data returning correctly I could come back to that part and figure it out my main concern was making the zip code dynamic, which proved a challenge as I was building out this part of the challenge.

```javascript
function saveUserZip() {
    const userZip = document
        .getElementById('zipcode')
        .value;
    const printZip = document
        .getElementById("tempforski")
        .innerHTML = userZip;
    return (printZip);
}
console.log('printZip before returnConditions', printZip);
```
#### requestObservation
* The point of this function is to make the API call, deliver temperature and stats, and provide a value in order to return a rating of outdoor activity viability - checkConditions in theory will check that the temperature is between a certain range I want to make the API request only on .click on the checkConditions so that the API returns the temperature, talks to my functions, and returns the correct condition report.
* **line 19** - here I noticed that when I sent this request to Postman I got back a different object using this [URL query](http://api.aerisapi.com/observations/55406?client_id=RPWkCaESX2v8UsgEhZSu8ient_secret=NIKctIWAkkEvTHWQsELj51e32qonWWGVS0DZ7OV5) so that got me curious about how this object with the observation was being returned. I realized that the `ob` object  in the example observation was actually just part of the larger object that gets returned, `ob` and `place`. So rather than setting `ob` as const ob, I just started my query higher up in the object and set `result.data` as my primary source of truth.

#### requestForecast
* **line 65** - Well, knowing the current conditions is all well and dandy, but what if I need to wax skis and travel? I might need to know what the conditions are in Wisconsin, or Oregon, or the Iron Range. My location doesn't help me there, so let's add a forecast so that I can see what the predictions are for the location of my race.

###  moraleAfterSki() :
*  **line 97** : So now that I was getting back the information that I wanted and a forecast for any* location of my choosing, now I want to know just how miserable I'll be on my ski. This is an elaborated version of Waxxer 1.0, where I simply passed in a numeric temperature and returned a color based on a number of wax charts I found online from Swix, START, and Toko, three major wax makers.
*  Initially, I was trying to target the element that contained the outputted the temperature in Fahrenheit for use in this function, but was having trouble honing in, as `.value` was null. So I monkeyed and selected the entire element and was able to narrow it down.
 ```javascript
const tempOuter = document.getElementById('tempF');
 console.log('tempOuter:', tempOuter);
```

### Fun Things I Learned
* **insertAdjacentHTML()** - This bit of API fun piqued my interest as I dug into more comprehensive API education. As I was going through the examples in Aeris' docs, I saw this as part of the forecast loop. I wanted to understand what I was looking at so the MDN web API docs helped me out here as I leanred a bit more about "a DOMString representing the position relative to the element; must be `beforebegin': Before the element itself`; `afterbegin': Just inside the element, before its first child`; `beforeend': Just inside the element, after its last child.`;`afterend': After the element itself.`.


## Closing Thoughts
All in all, this challenge was the kick in the pants I needed to bring this project to the next level. I had some time to chew on this and challenge myself to figure out how to best intertwine this API with my existing project. I feel like a strong developer and I absolutely have a strong understanding of API usage and technology  overall.