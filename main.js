$(document).ready(function() {
    var $kelvin = $('.option-kelvin');
    var $olympics = $('.option-olypmics').hide();
    var $dirt = $(.)

    $('.wpp_search_select_field_location').change(function() {
        var selectedValue = $(this).val();

        if(selectedValue  === 'Kelvin') {
            $value1.show();
            $value2.hide();
        } else if (selectedValue === 'Costa Del Sol West') {
            $value1.hide();
            $value2.show();
        } else {
            $value1.hide();
            $value2.hide();
        }
    });
});



// Convert from Fahrenheit to Celsius	℃=(℉-32)/1.8
// <p>
//   <label>Fahrenheit</label>
//   <input id="inputFahrenheit" type="number" placeholder="Fahrenheit" oninput="temperatureConverter(this.value)" onchange="temperatureConverter(this.value)">
// </p>
// <p>Celcius: <span id="outputCelcius"></span></p>
//
// <script>
// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   document.getElementById("outputCelcius").innerHTML=(valNum-32)/1.8;
// }
// </script>


// Convert from Fahrenheit to Kelvin	K=((℉-32)/1.8)+273.15
// <p>
//   <label>Fahrenheit</label>
//   <input id="inputFahrenheit" type="number" placeholder="Fahrenheit" oninput="temperatureConverter(this.value)" onchange="temperatureConverter(this.value)">
// </p>
// <p>Kelvin: <span id="outputKelvin"></span></p>
//
// <script>
// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   document.getElementById("outputKelvin").innerHTML=((valNum-32)/1.8)+273.15;
// }
// </script>


// Convert from Celsius to Fahrenheit	℉=(℃*1.8)+32
// <p>
//   <label>Celsius</label>
//   <input id="inputCelsius" type="number" placeholder="Celsius" oninput="temperatureConverter(this.value)" onchange="temperatureConverter(this.value)">
// </p>
// <p>Fahrenheit: <span id="outputFahrenheit"></span></p>
//
// <script>
// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   document.getElementById("outputFahrenheit").innerHTML=(valNum*1.8)+32;
// }
// </script>


// Convert from Celsius to Kelvin	K=℃+273.15
// <p>
//   <label>Celsius</label>
//   <input id="inputCelsius" type="number" placeholder="Celsius" oninput="temperatureConverter(this.value)" onchange="temperatureConverter(this.value)">
// </p>
// <p>Kelvin: <span id="outputKelvin"></span></p>
//
// <script>
// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   document.getElementById("outputKelvin").innerHTML=valNum+273.15;
// }
// </script>


// Convert from Kelvin to Fahrenheit	℉=((K-273.15)*1.8)+32
// <p>
//   <label>Kelvin</label>
//   <input id="inputKelvin" type="number" placeholder="Kelvin" oninput="temperatureConverter(this.value)" onchange="temperatureConverter(this.value)">
// </p>
// <p>Fahrenheit: <span id="outputFahrenheit"></span></p>
//
// <script>
// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   document.getElementById("outputFahrenheit").innerHTML=((valNum-273.15)*1.8)+32;
// }
// </script>


// Convert from Kelvin to Celsius	℃=K-273.15
// <p>
//   <label>Kelvin</label>
//   <input id="inputKelvin" type="number" placeholder="Kelvin" oninput="temperatureConverter(this.value)" onchange="temperatureConverter(this.value)">
// </p>
// <p>Celcius: <span id="outputCelcius"></span></p>
//
// <script>
// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   document.getElementById("outputCelcius").innerHTML=valNum-273.15;
// }
// </script>
