function convertFtoC(valNum) {
    valNum = parseFloat(valNum);
    document.getElementById("outputCelsius").innerHTML = ((valNum - 32) / 1.8).toFixed(1);
}

function convertCtoF(valNum) {
    valNum = parseFloat(valNum);
    document.getElementById("outputFahrenheit").innerHTML = ((valNum * 1.8) + 32).toFixed(1);
}

function returnWaxColor() {
    var wax = document.getElementById('inputFahrenheit').value;
    if (wax > 34 && wax < 70) {
        document.getElementById("wax-color-div").innerHTML = "red";
        console.log(wax, "red");
    } else if (wax > 30 && wax < 33) {
        document.getElementById("wax-color-div").innerHTML = "violet";
        console.log(wax, "violet");
    } else if (wax > 15 && wax < 29) {
        document.getElementById("wax-color-div").innerHTML = "blue";
        console.log(wax, "blue");
    } else if (wax > -3 && wax < 14) {
        document.getElementById("wax-color-div").innerHTML = "green";
        console.log(wax, "green");
    } else if (wax > -22 && wax < -4) {
        document.getElementById("wax-color-div").innerHTML = "polar";
        console.log(wax, "polar");
    };
    // break returnWaxColor;
}











// $(document).getElementById('temp-FC-select').addEventListener('change', function() {
//     var style = this.value == 1 ? 'block' : 'none';
//     document.getElementById('celsius-input').style.display = style;
// });


// Skelecode:
// When tempInput is F, use convertFtoC()
// When tempInput is C, use convertCtoF()

// $(document).ready(function() {
//     var $fahrenheit = $('.option-fahrenheit');
//     var $celsius = $('.option-celsius')
//     var $kelvin = $('.option-kelvin');
//     var $olympics = $('.option-olypmics').hide();
//     var $dirt = $('.option-dirt');

//     //     $('.wpp_search_select_field_location').change(function() {
//     //         var selectedValue = $(this).val();

//     //         if (selectedValue === 'Kelvin') {
//     //             $value1.show();
//     //             $value2.hide();
//     //         } else if (selectedValue === 'Costa Del Sol West') {
//     //             $value1.hide();
//     //             $value2.show();
//     //         } else {
//     //             $value1.hide();
//     //             $value2.hide();
//     //         }
//     //     });
// });