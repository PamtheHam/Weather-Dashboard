// This is a JavaScript file
// Use the [OpenWeather One Call API](https://openweathermap.org/api/one-call-api) to retrieve weather data for cities. Read through the documentation for setup and usage instructions. You will use `localStorage` to store any persistent data.

// search container elements
var searchCity = document.getElementById('#search-city');
var searchButtonContainer = document.getElementById('#search-button-container')
var historyButtonsContainer = document.getElementById('#history-buttons')
// current weather now container elements

var currentWeatherContainer = document.querySelector('.current-weather-title')
var currentIcon = document.querySelector('.current-weather-icon');
var currentTemp = document.querySelector('.current-temp');
var currentWind = document.querySelector('.current-wind');
var currentHumidity = document.querySelector('.current-humidity');
var currentUVI = document.querySelector('.current-uvi')
// forecast container elements

var forecastDateEl = document.querySelector('.forecast-date')
var forecastIcon = document.querySelector('.forecast-weather-icon')
var tempForecast = document.querySelector('.temp-forecast');
var windForecast = document.querySelector('.wind-forecast');
var humidForecast = document.querySelector('.humid-forecast');
const currentDate = moment();
var cityStorageArr = JSON.parse(localStorage.getItem('City:')) || [];

function init(){
    searchButtonContainer.addEventListener('click', getUserInput)
    searchHistory();
}


function getUserInput(event){
    if (event.target.classList.contains('history-buttons')){
        return currentDateCard(event.target.textContent);
    }
}


// // creates new buttons to pop up with the users input 
function renderCityButtons(cityHistory) {
    var newCityButtons = document.createElement("button");
    newCityButtons.setAttribute("class", "btn btn-primary history-buttons");
    newCityButtons.textContent = cityHistory;
    historyButtonsContainer.appendChild(newCityButtons);
    newCityButtons.addEventListener('click', getUserInput)
}

// // only stores up to 5 cities
function searchHistory(){
    searchButtonContainer.innerHTML = "";
    var limitCityStorageArr = cityStorageArr.slice(0, 5);
    for (var i = 0; i < limitCityStorageArr.length; i++) {
        renderCityButtons(limitCityStorageArr[i]);
    }
}

// // get the city and weather data for current city
function currentDateCard(cityHistory){
    var currentWeatherCard = cityHistory + ' ' + currentDate.format('M/D/YYYY')
    currentWeatherContainer.textContent = currentWeatherCard;
    cityStorageArr.push(cityHistory);
    localStorage.setItem('City:', JSON.stringify(cityStorageArr));
    fetchLatAndLong(cityHistory);
}



// // gets listed city and then calls fetchWeather function to get weather data of that city
function fetchLatAndLong(cityHistory){
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + cityHistory + '&limit=1&appid=59ebbdcff8cb1a77a710a662d63df5c4')
      .then (function (response) {
        return response.json();
      })

      .then (function (data) {
          var latitude = data[0].lat;
          var longitude = data[0].lon;

        fetchWeather(latitude, longitude);
      })
    }

function fetchWeather(latitude, longitude){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,alerts&units=imperial&appid=59ebbdcff8cb1a77a710a662d63df5c4')
          .then (function (response) {
            return response.json();
          })
           // gives current data on weather
          .then (function (data) {
            var weather;

            weather = {               
            weatherIcon :'https://openweathermap.org/img/wn/10d@2x.png' + data.current.weather[0].icon,
            temp : data.current.temp + ' F',
            wind : data.current.wind_speed + ' MPH',
            humidity : data.current.humidity + ' %',
            UVIndex : data.current.uvi,
        };
        
        // gives daily weather for 5 different days
        var weatherForecastArr = [];
        
        for(var i = 0; i <5; i++) { 
            weatherForecastArr.push(
            {
            weatherIcon : 'https://openweathermap.org/img/wn/10d@2x.png' + data.daily[i].weather[0].icon,
            temp : data.daily[i].temp + ' F',
            wind : data.daily[i].wind_speed + ' MPH',
            humidity : data.daily[i].humidity + ' %',
            })
        }

            renderWeatherNow(weather);
            renderWeatherForecast(weatherForecastArr);
        
        }
          )
    }
        

// gets the weather for the current city
function renderWeatherNow(weather){

    currentIcon.setAttribute('src', weather.weatherIcon);
    currentTemp.textContent = weather.temp;
    currentWind.textContent = weather.wind;
    currentHumidity.textContent = weather.humidity;
    currentUVI.textContent = weather.UVIndex;


    if (weather.UVIndex < 3){
        currentUVI.setAttribute('class', 'card-text btn btn-success')
    }
    else if (weather.UVIndex > 3 && weather.UVIndex < 5){
        currentUVI.setAttribute('class', 'card-text btn btn-warning')
    }
    else {
        currentUVI.setAttribute('class', 'card-text btn btn-danger')
    }
}



// // puts the weather forecast for the next 5 days in the forecast container
function renderWeatherForecast(weatherForecastArr) {
    for(var i = 0; i < weatherForecastArr.length; i++){

    var futureForecasts = [
        currentDate.clone().add(1, 'Days'),
        currentDate.clone().add(2, 'Days'),
        currentDate.clone().add(3, 'Days'),
        currentDate.clone().add(4, 'Days'),
        currentDate.clone().add(5, 'Days'),
        ];

        forecastDateEl[i].textContent = futureForecasts[i].format('M/D/YYYY');
        
        forecastIcon[i].setAttribute('src', weatherForecastArr[i].weatherIcon );
        tempForecast[i].textContent = weatherForecastArr[i].temp;
        windForecast[i].textContent = weatherForecastArr[i].wind;
        humidForecast[i].textContent = weatherForecastArr[i].humidity;
    }
}
renderWeatherNow();
init();