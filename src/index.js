"use strict";


const state = {
    // start temparture with info from API call
    // state city name from
    city: "Seattle",
    temperature: 0, 
    lat: 0,
    lon: 0,
    original_landscape: "🌵🌼🌸🍁🌵🌼🌸🍁"
};

const getCityName = (event) => {
    const inputElement = document.getElementById("city-name")
    state.city = inputElement.value;
    const cityDisplay = document.querySelector("h3");
    cityDisplay.textContent = "For the lovely city of " + "🌟" + state.city + "🌟";
}

const increaseTemp = (event) => {
    state.temperature ++;
    const tempCount = document.getElementById("temp-count");
    tempCount.textContent = `${state.temperature}`;  
    changeColorByTemp();
};

const decreaseTemp = (event) => {
    state.temperature -= 1;
    const tempCount = document.getElementById("temp-count");
    tempCount.textContent = `${state.temperature}`;  
    changeColorByTemp();
};

const resetLocation = (event) => {
    const locationInput = document.getElementById("city-name");
    locationInput.value = "";
    state.city = "";
    getCityName(); //call getCityName to reset h3
    state.temperature = 0;
    const tempCount = document.getElementById("temp-count");
    tempCount.textContent = state.temperature;
    changeColorByTemp();
    const emojiLandscape = document.querySelector('#landscape');
    emojiLandscape.textContent = state.original_landscape;
    
};

const changeSky = (event) => {
    const selectElement = document.querySelector(".sky-select");
    const output = selectElement.value;
    const sky = document.querySelector("#sky")
    if (output === 'sunny') {
        sky.textContent = '☁️ ☁️ __❗ 🌞❗__   ☁️☁️';
    } else if (output === 'cloudy') {
        sky.textContent = '☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️';
    } else if (output === 'rainy') {
        sky.textContent = '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧';
    } else if (output === 'snowy') {
        sky.textContent = '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨';
    }
}

const changeColorByTemp = (event) => {
    // make js to change color using state temperature variable
    const tempCount = document.querySelector('#temp-count');
    const emojiLandscape = document.querySelector('#landscape')
    if (state.temperature >= 80) {
        tempCount.setAttribute("class", "red");
        emojiLandscape.textContent = "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂";
    } else if (state.temperature >= 70 && state.temperature <= 79) {
        tempCount.setAttribute("class", "orange");
        emojiLandscape.textContent = "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷";
    } else if (state.temperature >= 60 && state.temperature <= 69) {
        tempCount.setAttribute("class", "yellow");
        emojiLandscape.textContent = "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃"
    } else if (state.temperature >= 50 && state.temperature <= 59) {
        tempCount.setAttribute("class", "green");
        emojiLandscape.textContent= "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
    } else if (state.temperature <= 49) {
        tempCount.setAttribute("class", "teal");
        emojiLandscape.textContent= "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
    }
}

// Calling API's
const searchLocation = () => {
    
    axios
    .get('http://127.0.0.1:5000/location', {
        params:{
        q: state.city, //insert city name of input
        }  
    })
    .then((response) => {
    console.log('success!');
    state.lat = response.data[0].lat;
    state.lon = response.data[0].lon
    // wait to get results lat and lon to call search temp
    searchTemperature();
        })
    
    .catch((error) => {
        console.log('searchLocation error: ' +
        error.response);
    });
};

const searchTemperature = () => {
    axios
    .get('http://localhost:5000/weather', {
        params: {
        lat: state.lat,
        lon: state.lon,
        },
      })
    .then((response) => {
        state.temperature = ((response.data.main.temp - 273.15) * 1.8 + 32).toFixed(0);

        // return current temp and assign to #temp count
        const tempCount = document.querySelector("#temp-count");
        tempCount.textContent = `${state.temperature}`; 
        changeColorByTemp();
      })
    .catch((error) => {
        console.log('searchTemperature error: ' + error.response);
      });
  };


const registerEventHandlers = (event) => {
    const tempUpButton = document.querySelector("#up-arrow");
    tempUpButton.addEventListener("click", increaseTemp);
    // tempUpButton.addEventListener("click", changeColorByTemp); 

    const tempDownButton = document.querySelector("#down-arrow");
    tempDownButton.addEventListener("click", decreaseTemp);

    const inputElement = document.querySelector("#city-name");
    inputElement.addEventListener("input", getCityName);
        
    const changeLocation = document.querySelector('#realtime-button-weather');
    changeLocation.addEventListener('click', searchLocation);

    const selectElement = document.querySelector(".sky-select")
    selectElement.addEventListener("change", changeSky)

    const resetCity = document.querySelector("#reset-city-name");
    resetCity.addEventListener("click", resetLocation);
};
document.addEventListener("DOMContentLoaded", registerEventHandlers)