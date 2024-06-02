import { State } from "../util/state.js"; 
import { LocationQuery, LocationStorage, Utilities } from "../util/Utilities.js";
import { WeatherRequest } from "../util/WeatherRequest.js";
import { WeatherSettings } from "../settings/WeatherSettings.js";

class WeatherPage {
    // to allow the UI display the projected weather for each hour within the day 
    static displayHourlyForecast = ( 
        metric
    ) => {
        const dailyContainer = document.querySelector(".dailyForecast");
        dailyContainer.addEventListener("click", () => {
            dailyContainer.childNodes.forEach(forecast => {
                forecast.addEventListener("click", () => {
                    const iconElement = document.querySelector(".weatherPageTempDigits i");
                    iconElement.className = `${forecast.childNodes[1].className} weather-icon`;
                    iconElement.style.color = forecast.childNodes[1].style.color;

                    const tempElement = document.querySelector(".tempNum h1"); 
                    const newTempElement = forecast.childNodes[2].textContent; 
                    (metric === "imperial") ? 
                    tempElement.textContent = newTempElement + "F" : 
                    tempElement.textContent = newTempElement + "C"; 

                    const dateElement = document.querySelector(".weatherPageLocation h3");
                    const date = new Date(Date.now()); 
                    dateElement.textContent = (forecast.childNodes[0].textContent !== "Now") ? 
                    `${State.dayNames[date.getDay()]} ${forecast.childNodes[0].textContent}` :
                    ((date.toLocaleTimeString().length % 2 === 0) ? 
                    (`${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
                    ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
                    (`${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
                    ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`));
                    
                    const labelElement = document.querySelector(".weatherPageHighlightsContainer h4"); 
                    if (labelElement.textContent !== "Today's Highlights") {
                        const minMaxElement = document.querySelector(".tempNum h6");  
                        labelElement.textContent  = "Today's Highlights"; 
                        minMaxElement.textContent = `${Math.round(State.currentWeather.main.temp_max)}` + "\u00b0" + " / " + `${Math.round(State.currentWeather.main.temp_min)}` + "\u00b0";   
                        Utilities.setStats(
                            State.windElement, 
                            State.rainElement, 
                            State.humidityElement, 
                            State.cloudyElement, 
                            State.flag, 
                            State.currentWeather.wind.speed, 
                            State.currentWeather, 
                            State.currentWeather.main.humidity, 
                            State.currentWeather.clouds.all
                        );
                        Utilities.setHighlights(
                            State.feelsLikeElement, 
                            State.visibilityElement, 
                            State.sunriseElement, 
                            State.sunsetElement, 
                            State.currentWeather.main.feels_like, 
                            State.currentWeather.visibility, 
                            State.currentWeather.sys.sunrise, 
                            State.currentWeather.sys.sunset
                        );
                    }
                });
            }); 
        }); 
    }; 

    // to display forecast for today's weather 
    static weeklyForecastTodayUtil = (
        date, 
        flag, 
        today, 
        labelElement, 
        dayElement
    ) => {
        labelElement.textContent = "Today's Highlights"; 
        dayElement.textContent = (date.toLocaleTimeString().length % 2 === 0) ? 
        (`${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
        ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
        (`${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
        ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);
        
        const tempElement = document.querySelector('.tempNum h1');
        const minMaxElement = document.querySelector('.tempNum h6'); 
        console.log(State.currentWeather)
        Utilities.setTemp(
            tempElement, 
            minMaxElement, 
            State.metric, 
            today.main.temp, 
            today.main.temp_max, 
            today.main.temp_min
        ); 
        Utilities.setStats(
            State.windElement, 
            State.rainElement, 
            State.humidityElement, 
            State.cloudyElement, 
            flag, 
            today.wind.speed, 
            today, 
            today.main.humidity, 
            today.clouds.all
        );
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            today.main.feels_like, 
            today.visibility, 
            today.sys.sunrise, 
            today.sys.sunset
        );
    }; 

    // to display forecast for days that are not today
    static weeklyForecastOtherUtil = (
        forecast, 
        idx, 
        flag, 
        data, 
        minTemp, 
        maxTemp, 
        dayTitle, 
        labelElement, 
        dayElement
    ) => {
        labelElement.textContent = `${dayTitle}'s Highlights`; 
        dayElement.textContent = forecast.childNodes[0].textContent;

        const tempElement = document.querySelector('.tempNum h1');  
        const minMaxElement = document.querySelector('.tempNum h6'); 
        Utilities.setTemp(
            tempElement, 
            minMaxElement, 
            State.metric, 
            parseInt(maxTemp), 
            parseInt(maxTemp), 
            parseInt(minTemp)
        );
        Utilities.setStats(
            State.windElement, 
            State.rainElement, 
            State.humidityElement, 
            State.cloudyElement, 
            flag, 
            data[idx-1].speed, 
            data[idx-1], 
            data[idx-1].humidity, 
            data[idx-1].clouds
        ); 
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            Math.round((data[idx-1].feels_like["day"] + data[idx-1].feels_like["night"] + data[idx-1].feels_like["eve"] + data[idx-1].feels_like["morn"]) / 4), 
            "???", 
            data[idx-1].sunrise, 
            data[idx-1].sunset
        );
    }; 

    // to allow the UI display the projected weather for the days within the week 
    static displayWeeklyForecast = (
        data
    ) => {
        const forecastElement = document.querySelector(".forecastWeather"); 
        forecastElement.addEventListener("click", () => {
            const dayElement = document.querySelector(".weatherPageLocation h3"); 
            const iconElement = document.querySelector(".weatherPageTempDigits i");  
            const labelElement = document.querySelector(".weatherPageHighlightsContainer h4");
            
            forecastElement.childNodes.forEach((forecast, idx) => {
                forecast.addEventListener("click", () => {
                    const maxTemp = forecast.childNodes[2].textContent.split("/")[0];
                    const minTemp = forecast.childNodes[2].textContent.split("/")[1];  

                    if (forecast.childNodes[0].textContent === "Today") {
                        const date = new Date(Date.now());              
                        WeatherPage.weeklyForecastTodayUtil(
                            date, 
                            State.flag, 
                            State.currentWeather, 
                            labelElement, 
                            dayElement
                        );
                    } else {
                        WeatherPage.weeklyForecastOtherUtil(
                            forecast, 
                            idx, 
                            State.flag, 
                            data, 
                            minTemp, 
                            maxTemp, 
                            forecast.childNodes[0].textContent, 
                            labelElement, 
                            dayElement
                        ); 
                    }
                    iconElement.className = `${forecast.childNodes[1].className} weather-icon`;   
                    iconElement.style.color = forecast.childNodes[1].style.color; 
                }); 
            }); 
        }); 
    }; 

    // requests data from openWeatherAPI for today's weather and climate 
    static currentWeather = (
        lat, 
        lon, 
        city
    ) => {
        WeatherRequest.requestCurrentWeather(lat, lon)
        .then(res => res.json())
        .then(data => { 
            const weatherDesc = data.weather[0].description; 
            const iconElement = document.querySelector(".weatherPageTempDigits i"); 
            Utilities.setIcon(iconElement, weatherDesc); 
            iconElement.className = `${iconElement.className} weather-icon`; 

            const locationElement = document.querySelector(".weatherPageLocation h1"); 
            const dateElement = document.querySelector(".weatherPageLocation h3"); 
            Utilities.setInfo(locationElement, dateElement, city); 
            
            const tempElement = document.querySelector('.tempNum h1'); 
            const minMaxElement = document.querySelector('.tempNum h6'); 
            Utilities.setTemp(
                tempElement, 
                minMaxElement, 
                State.metric, 
                data.main.temp, 
                data.main.temp_max, 
                data.main.temp_min
            ); 
            Utilities.setStats(
                State.windElement, 
                State.rainElement,  
                State.humidityElement, 
                State.cloudyElement, 
                State.flag, 
                data.wind.speed, 
                data, 
                data.main.humidity, 
                data.clouds.all
            ); 
            Utilities.setHighlights(
                State.feelsLikeElement, 
                State.visibilityElement, 
                State.sunriseElement, 
                State.sunsetElement, 
                data.main.feels_like, 
                data.visibility, 
                data.sys.sunrise, 
                data.sys.sunset
            ); 
            State.currentWeather = data; 
            console.log("TODAY'S WEATHER:", data); 
        })
        .catch(error => console.log(error)); 
    };

    // requests data from openWeatherAPI for today's weather hourly forecast  
    static dailyForecast = (
        lat, 
        lon
    ) => {
        WeatherRequest.requestCurrentForecast(lat, lon)
        .then(res => res.json())
        .then(data => {
            const dailyInfo = data.list;
            const forecastElement = document.querySelector(".dailyForecast"); 
            Utilities.setPresentForecast(forecastElement, dailyInfo); 
            WeatherPage.displayHourlyForecast(State.metric); 
            console.log("DAILY FORECAST:", data); 
        })
        .catch(error => console.log(error));  
    };

    // requests data from openWeatherAPI for this week's weather daily forecast  
    static weeklyForecastWeather = (
        lat, 
        lon
    ) => {
        WeatherRequest.requestFutureForecast(lat, lon)
        .then(res => res.json())
        .then(data => {
            const weekInfo = data.list; 
            const futureForecastElement = document.querySelector(".forecastWeather"); 
            Utilities.setFutureForecast(futureForecastElement, weekInfo); 
            WeatherPage.displayWeeklyForecast(weekInfo); 
            console.log("WEEKLY FORECAST:", data); 
        })
        .catch(error => console.log(error)); 
    }; 

    // initializes data call for weather board and loads it onto the UI of the specific town requested 
    static callWeatherData = (
        city, 
        state
    ) => {
        WeatherRequest.requestCurrentCoordinates(city, state)
        .then(res => res.json())
        .then(data => {
            const lat = data[0].lat; 
            const lon = data[0].lon; 
            // request data for specific statistics 
            WeatherPage.currentWeather(lat, lon, city); 
            WeatherPage.dailyForecast(lat, lon); 
            WeatherPage.weeklyForecastWeather(lat, lon); 
        })
        .catch(error => console.log(error)); 
    };

    // if track current location is given accessed, then generate data for the current location as requested 
    static successCallback = (
        pos
    ) => {
        const lat = pos.coords.latitude; 
        const lon = pos.coords.longitude; 
        WeatherRequest.requestCurrentLocation(lat, lon)
        .then(res => res.json())
        .then(data => {
            Utilities.clearWeather();
            State.cityStatePair = {"city": data[0].name, "state": data[0].state}; 
            WeatherPage.currentWeather(lat, lon, data[0].name); 
            WeatherPage.dailyForecast(lat, lon); 
            WeatherPage.weeklyForecastWeather(lat, lon); 
        })
        .catch(error => console.log(error)); 
    }; 

    static getCurrentLocation = () => {
        const currentLocationElement = document.querySelector(".fa-location-dot"); 
        currentLocationElement.addEventListener("click", () => {
            navigator.geolocation.getCurrentPosition(WeatherPage.successCallback, err => console.log(err)); 
            console.log("requested current location...");  
        })
    }; 

    // searching option for data of weather for a specific inputted with regards to the format "City, State"
    static searchLocation = () => {
        const formElement = document.querySelector('.inputWrapper'); 
        formElement.addEventListener('submit', (e) => {
            const locationValue = document.querySelector(".weather-addLocation").value.trim(); 
            Utilities.parseInput(locationValue); 
            e.preventDefault(); 
            Utilities.clearWeather(); 
            WeatherPage.callWeatherData(State.cityStatePair["city"], State.cityStatePair["state"]); 
            document.querySelector(".weather-addLocation").value = ""; 
            console.log("searched for location"); 
        }); 
    }; 

    // to switch to fahrenheit or celsius and re-display onto UI 
    static switchMetrics = () => {
        const fahrenheitElement = document.querySelector(".wi-fahrenheit");
        const celsiusElement = document.querySelector(".wi-celsius"); 
        fahrenheitElement.addEventListener("click", () => {
            if (State.metric === "metric") {
                State.metric = "imperial";
                Utilities.clearWeather(); 
                WeatherPage.callWeatherData(State.cityStatePair["city"], State.cityStatePair["state"]); 
                console.log("switched to fahrenheit");
            }
        }); 
        celsiusElement.addEventListener("click", () => {
            if (State.metric === "imperial") {
                State.metric = "metric"; 
                Utilities.clearWeather(); 
                WeatherPage.callWeatherData(State.cityStatePair["city"], State.cityStatePair["state"]); 
                console.log("switched to celsius"); 
            }
         }); 
    }; 

    static displayWeather = () => {
        const cachedLocation = State.locationStorage.getItem("toggledLocation") && 
                                JSON.parse(State.locationStorage.getItem("toggledLocation"));
        if (cachedLocation && cachedLocation.length) {
            const [city, state] = cachedLocation.split(","); 

            LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                .then(data => {
                    const { 
                        presentForecastStats,
                        presentTempStats, 
                        presentTemperature, 
                        futureForecastStats, 
                        highLowTemperature,
                        weatherCondition
                    } = data;
                    
                    const iconElement = document.querySelector(".weatherPageTempDigits i"); 
                    Utilities.setIcon(iconElement, weatherCondition); 
                    iconElement.className = `${iconElement.className} weather-icon`;

                    const locationElement = document.querySelector(".weatherPageLocation h1"); 
                    const dateElement = document.querySelector(".weatherPageLocation h3");  
                    Utilities.setInfo(locationElement, dateElement, presentForecastStats.city.name); 

                    const tempElement = document.querySelector('.tempNum h1'); 
                    const minMaxElement = document.querySelector('.tempNum h6'); 
                    Utilities.setTemp(
                        tempElement,
                        minMaxElement,
                        State.metric,
                        presentTemperature,
                        highLowTemperature.hi, 
                        highLowTemperature.low
                    ); 
                    Utilities.setStats(
                        State.windElement, 
                        State.rainElement, 
                        State.humidityElement, 
                        State.cloudyElement, 
                        State.flag, 
                        presentTempStats.wind,
                        presentTempStats,
                        presentTempStats.humidity,
                        presentTempStats.clouds
                    ); 
                    Utilities.setHighlights(
                        State.feelsLikeElement, 
                        State.visibilityElement, 
                        State.sunriseElement, 
                        State.sunsetElement, 
                        presentTempStats.rain.main.feels_like,
                        presentTempStats.rain.visibility,
                        presentTempStats.rain.sys.sunrise, 
                        presentTempStats.rain.sys.sunset
                    );
                    State.currentWeather = presentTempStats.rain; 
                    State.cityStatePair = {"city": city, "state": state}; 
                    const todayForecastElement = document.querySelector(".dailyForecast"); 
                    Utilities.setPresentForecast(todayForecastElement, presentForecastStats.list); 

                    const futureForecastElement = document.querySelector(".forecastWeather"); 
                    Utilities.setFutureForecast(futureForecastElement, futureForecastStats.list);
                    WeatherPage.displayHourlyForecast(State.metric); 
                    WeatherPage.displayWeeklyForecast(futureForecastStats.list); 
                    WeatherPage.switchMetrics(); 
                }); 
        }
    }; 
}; 

State.relPath === "WeatherPage.html" && 
window.addEventListener("load", () => {
    const setting = new WeatherSettings;
    setting.displaySettings();     
    
    WeatherPage.searchLocation(); 
    WeatherPage.getCurrentLocation(); 
    WeatherPage.displayWeather(); 
});

export { WeatherPage }; 