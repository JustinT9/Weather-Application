import { State } from "../util/state.js"; 
import { LocationQuery, Utilities } from "../util/Utilities.js";
import { WeatherRequest } from "../util/WeatherRequest.js";
import { WeatherSettings } from "../settings/WeatherSettings.js";
import { LocationHandler } from "../menu/WeatherMenu.js";

class WeatherPage {
    // To allow the UI display the projected weather for each hour within the day 
    static displayHourlyForecast = ( 
        metric
    ) => {
        const dailyContainer = document.querySelector(".dailyForecast");
        dailyContainer.addEventListener("click", () => {
            dailyContainer.childNodes.forEach(
                forecast => {
                    forecast.addEventListener("click", () => {
                        const iconElement = document.querySelector(".weatherPageTempDigits i");
                        iconElement.className = `${forecast.childNodes[1].className} weather-icon`;
                        iconElement.style.color = forecast.childNodes[1].style.color;

                        const tempElement = document.querySelector(".tempNum h1"); 
                        (metric === "imperial") ? 
                        tempElement.textContent = forecast.childNodes[2].textContent + "F" : 
                        tempElement.textContent = forecast.childNodes[2].textContent + "C"; 

                        const date = new Date(Date.now()); 
                        const dateElement = document.querySelector(".weatherPageLocation h3");
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
                            minMaxElement.textContent = `${Math.round(State.currentWeather.main.temp_max)}` + "\u00b0" + " / " + `${Math.round(State.currentWeather.main.temp_min)}` + "\u00b0";   
                            labelElement.textContent  = "Today's Highlights"; 
                            Utilities.setStats(
                                State.windElement, 
                                State.rainElement, 
                                State.humidityElement, 
                                State.cloudyElement, 
                                State.flag, 
                                State.currentWeather.wind.speed, 
                                State.currentWeather, 
                                State.currentWeather.main.humidity, 
                                State.currentWeather.clouds.all);
                            Utilities.setHighlights(
                                State.feelsLikeElement, 
                                State.visibilityElement, 
                                State.sunriseElement, 
                                State.sunsetElement, 
                                State.currentWeather.main.feels_like, 
                                State.currentWeather.visibility, 
                                State.currentWeather.sys.sunrise, 
                                State.currentWeather.sys.sunset);
                        }
                    });
                }); 
            }); 
        }; 

    // To display forecast for today's weather 
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
        Utilities.setTemp(
            tempElement, 
            minMaxElement, 
            State.metric, 
            today.main.temp, 
            today.main.temp_max, 
            today.main.temp_min); 
        Utilities.setStats(
            State.windElement, 
            State.rainElement, 
            State.humidityElement, 
            State.cloudyElement, 
            flag, 
            today.wind.speed, 
            today, 
            today.main.humidity, 
            today.clouds.all);
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            today.main.feels_like, 
            today.visibility, 
            today.sys.sunrise, 
            today.sys.sunset);
    }; 

    // To display forecast for days that are not today
    static weeklyForecastOtherUtil = (
        weatherData, 
        forecastElement, 
        dayOfTheWeek, 
        flag, 
        minTemp, 
        maxTemp, 
        dayTitle, 
        labelElement, 
        dayElement
    ) => {
        labelElement.textContent = `${dayTitle}'s Highlights`; 
        dayElement.textContent = forecastElement.childNodes[0].textContent;

        const tempElement = document.querySelector('.tempNum h1');  
        const minMaxElement = document.querySelector('.tempNum h6'); 
        Utilities.setTemp(
            tempElement, 
            minMaxElement, 
            State.metric, 
            parseInt(maxTemp), 
            parseInt(maxTemp), 
            parseInt(minTemp));
        Utilities.setStats(
            State.windElement, 
            State.rainElement, 
            State.humidityElement, 
            State.cloudyElement, 
            flag, 
            weatherData[dayOfTheWeek-1].speed, 
            weatherData[dayOfTheWeek-1], 
            weatherData[dayOfTheWeek-1].humidity, 
            weatherData[dayOfTheWeek-1].clouds); 
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            Math.round((weatherData[dayOfTheWeek-1].feels_like["day"] + weatherData[dayOfTheWeek-1].feels_like["night"] + weatherData[dayOfTheWeek-1].feels_like["eve"] + weatherData[dayOfTheWeek-1].feels_like["morn"]) / 4), 
            "???", 
            weatherData[dayOfTheWeek-1].sunrise, 
            weatherData[dayOfTheWeek-1].sunset);
    }; 

    // To allow the UI display the projected weather for the days within the week 
    static displayWeeklyForecast = (
        weatherData
    ) => {
        const forecastElement = document.querySelector(".forecastWeather"); 
        forecastElement.addEventListener("click", () => {
            const iconElement = document.querySelector(".weatherPageTempDigits i");  
            forecastElement.childNodes.forEach(
                (forecast, dayOfTheWeek) => {
                    forecast.addEventListener("click", () => {
                        const [maxTemp, minTemp] = 
                            [forecast.childNodes[2].textContent.split("/")[0], 
                            forecast.childNodes[2].textContent.split("/")[1]];  
                        const dayElement = document.querySelector(".weatherPageLocation h3"); 
                        const labelElement = document.querySelector(".weatherPageHighlightsContainer h4");
                        if (forecast.childNodes[0].textContent === "Today") {
                            const date = new Date(Date.now());              
                            WeatherPage.weeklyForecastTodayUtil(
                                date, 
                                State.flag, 
                                State.currentWeather, 
                                labelElement, 
                                dayElement);
                        } else {
                            WeatherPage.weeklyForecastOtherUtil(
                                weatherData, 
                                forecast, 
                                dayOfTheWeek, 
                                State.flag, 
                                minTemp, 
                                maxTemp, 
                                forecast.childNodes[0].textContent, 
                                labelElement, 
                                dayElement); 
                        }
                        iconElement.className = `${forecast.childNodes[1].className} weather-icon`;   
                        iconElement.style.color = forecast.childNodes[1].style.color; 
                    }
                ); 
            }); 
        }); 
    }; 

    static presentWeather = (
        presentWeather, 
        city
    ) => {
        const weatherDesc = presentWeather.weather[0].description; 
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
            presentWeather.main.temp, 
            presentWeather.main.temp_max, 
            presentWeather.main.temp_min); 
        Utilities.setStats(
            State.windElement, 
            State.rainElement,  
            State.humidityElement, 
            State.cloudyElement, 
            State.flag, 
            presentWeather.wind.speed, 
            presentWeather, 
            presentWeather.main.humidity, 
            presentWeather.clouds.all); 
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            presentWeather.main.feels_like, 
            presentWeather.visibility, 
            presentWeather.sys.sunrise, 
            presentWeather.sys.sunset); 
        State.currentWeather = presentWeather; 
        console.log("Today's Weather:", presentWeather); 
    };

    static presentForecast = (
        presentForecast
    ) => {
        const dailyInfo = presentForecast.list;
        const forecastElement = document.querySelector(".dailyForecast"); 
        Utilities.setPresentForecast(forecastElement, dailyInfo); 
        WeatherPage.displayHourlyForecast(State.metric); 
        console.log("Daily Forecast:", presentForecast); 
    };

    static weeklyForecastWeather = (
        futureForecast
    ) => {
        const weekInfo = futureForecast.list; 
        const futureForecastElement = document.querySelector(".forecastWeather"); 
        Utilities.setFutureForecast(futureForecastElement, weekInfo); 
        WeatherPage.displayWeeklyForecast(weekInfo); 
        console.log("Weekly Forecast:", futureForecast); 
    }; 

    // initializes data call for weather board and loads it onto the UI of the specific town requested 
    static callWeatherData = async(
        city, 
        state
    ) => {
        await LocationHandler.addToDb(city, state);
        LocationHandler.saveLocations(city, state); 
    };

    // if track current location is given accessed, then generate data for the current location as requested 
    static successCallback = (
        pos
    ) => {
        const [lat, lon] = [pos.coords.latitude, pos.coords.longitude]; 
        WeatherRequest.requestCurrentLocation(lat, lon)
        .then(res => res.json())
        .then(data => {
            Utilities.clearWeather();
            State.cityStatePair = {"city": data[0].name, "state": data[0].state}; 
            WeatherPage.presentWeather(lat, lon, data[0].name); 
            WeatherPage.presentForecast(lat, lon); 
            WeatherPage.weeklyForecastWeather(lat, lon); 
        })
        .catch(err => console.log(err)); 
    }; 

    static getCurrentLocation = () => {
        const currentLocationElement = document.querySelector(".fa-location-dot"); 
        currentLocationElement.addEventListener("click", () => {
            navigator.geolocation.getCurrentPosition(WeatherPage.successCallback, err => console.log(err)); 
            console.log("Requested current location.");  
        });
    }; 

    // searching option for data of weather for a specific inputted with regards to the format "City, State"
    static searchLocation = () => LocationHandler.inputLocation(".inputWrapper", ".weather-addLocation");
        
    // to switch to fahrenheit or celsius and re-display onto UI 
    static switchMetrics = () => {
        // const fahrenheitElement = document.querySelector(".wi-fahrenheit");
        // const celsiusElement = document.querySelector(".wi-celsius"); 
        // fahrenheitElement.addEventListener("click", () => {
        //     if (State.metric === "metric") {
        //         State.metric = "imperial";
        //         Utilities.clearWeather(); 
        //         WeatherPage.callWeatherData(State.cityStatePair["city"], State.cityStatePair["state"]); 
        //         console.log("switched to fahrenheit");
        //     }
        // }); 
        // celsiusElement.addEventListener("click", () => {
        //     if (State.metric === "imperial") {
        //         State.metric = "metric"; 
        //         Utilities.clearWeather(); 
        //         WeatherPage.callWeatherData(State.cityStatePair["city"], State.cityStatePair["state"]); 
        //         console.log("switched to celsius"); 
        //     }
        //  }); 
    }; 

    static displayWeather = () => {
        const toggledLocation = State.locationStorage.getItem("toggledLocation") && 
                                JSON.parse(State.locationStorage.getItem("toggledLocation"));
        if (toggledLocation && toggledLocation.length) {
            const [city, state] = toggledLocation.split(","); 
            LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                .then(weatherData => {
                    const { 
                        presentForecastStats,
                        presentTempStats, 
                        presentTemperature, 
                        futureForecastStats, 
                        highLowTemperature,
                        weatherCondition
                    } = weatherData;
                    
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
                        highLowTemperature.low); 
                    Utilities.setStats(
                        State.windElement, 
                        State.rainElement, 
                        State.humidityElement, 
                        State.cloudyElement, 
                        State.flag, 
                        presentTempStats.wind,
                        presentTempStats,
                        presentTempStats.humidity,
                        presentTempStats.clouds); 
                    Utilities.setHighlights(
                        State.feelsLikeElement, 
                        State.visibilityElement, 
                        State.sunriseElement, 
                        State.sunsetElement, 
                        presentTempStats.rain.main.feels_like,
                        presentTempStats.rain.visibility,
                        presentTempStats.rain.sys.sunrise, 
                        presentTempStats.rain.sys.sunset);
                    State.currentWeather = presentTempStats.rain; 
                    State.cityStatePair = {"city": city, "state": state}; 
                    const todayForecastElement = document.querySelector(".dailyForecast"); 
                    Utilities.setPresentForecast(todayForecastElement, presentForecastStats.list); 

                    const futureForecastElement = document.querySelector(".forecastWeather"); 
                    Utilities.setFutureForecast(futureForecastElement, futureForecastStats.list);
                    WeatherPage.displayHourlyForecast(State.metric); 
                    WeatherPage.displayWeeklyForecast(futureForecastStats.list); 
                    WeatherPage.switchMetrics(); 
                }
            ); 
        }
    }; 
}; 

State.relPath === "WeatherPage.html" && 
window.addEventListener("load", 
    () => {
        const setting = new WeatherSettings;
        setting.displaySettings();     
        WeatherPage.searchLocation(); 
        WeatherPage.getCurrentLocation(); 
        WeatherPage.displayWeather(); 
    }
);

export { WeatherPage }; 