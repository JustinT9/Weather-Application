import { State } from "../util/state.js"; 
import { LocationQuery, LocationStorage, Utilities } from "../util/Utilities.js";
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
                        const [
                            iconElement,
                            tempElement,
                            date,
                            dateElement,
                            labelElement
                        ] = [
                            document.querySelector(".weatherPageTempDigits i"),
                            document.querySelector(".tempNum h1"),
                            new Date(Date.now()),
                            document.querySelector(".weatherPageLocation h3"),
                            document.querySelector(".weatherPageHighlightsContainer h4")
                        ]; 
                        iconElement.className = `${forecast.childNodes[1].className} weather-icon`;
                        iconElement.style.color = forecast.childNodes[1].style.color;
                        tempElement.textContent =  metric === "imperial" ? 
                            forecast.childNodes[2].textContent + "F" : forecast.childNodes[2].textContent + "C"; 
                        dateElement.textContent = forecast.childNodes[0].textContent !== "Now" ? 
                            `${State.dayNames[date.getDay()]} ${forecast.childNodes[0].textContent}` :
                            date.toLocaleTimeString().length % 2 === 0 ? 
                                `${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
                                ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}` : 
                                `${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
                                ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`;
                        
                        if (labelElement.textContent !== "Today's Highlights") {
                            const minMaxElement = document.querySelector(".tempNum h6");  
                            minMaxElement.textContent = `${Math.round(
                                State.currentWeather.main.temp_max
                            )}` + "\u00b0" + " / " + `${Math.round(
                                State.currentWeather.main.temp_min
                            )}` + "\u00b0";   
                            labelElement.textContent = "Today's Highlights"; 
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

    // To display forecast for today's weather 
    static weeklyForecastTodayUtil = (
        date, 
        flag, 
        today, 
        labelElement, 
        dayElement
    ) => {
        labelElement.textContent = "Today's Highlights"; 
        Utilities.setTimeWithDayName(
            dayElement, 
            date,
            State.dayNames[date.getDay()]
        );     
        const [
            tempElement,
            minMaxElement
        ] = [
            document.querySelector('.tempNum h1'), 
            document.querySelector('.tempNum h6')
        ];
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

        const [
            tempElement,
            minMaxElement
        ] = [
            document.querySelector('.tempNum h1'), 
            document.querySelector('.tempNum h6')
        ]; 
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
            weatherData[dayOfTheWeek-1].speed, 
            weatherData[dayOfTheWeek-1], 
            weatherData[dayOfTheWeek-1].humidity, 
            weatherData[dayOfTheWeek-1].clouds
        ); 
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            Math.round(
                (weatherData[dayOfTheWeek-1].feels_like["day"] + 
                weatherData[dayOfTheWeek-1].feels_like["night"] + 
                weatherData[dayOfTheWeek-1].feels_like["eve"] + 
                weatherData[dayOfTheWeek-1].feels_like["morn"]) / 4
            ), 
            "???", 
            weatherData[dayOfTheWeek-1].sunrise, 
            weatherData[dayOfTheWeek-1].sunset
        );
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
                        const [
                            maxTemp, 
                            minTemp,
                            dayElement,
                            labelElement
                        ] = [
                            forecast.childNodes[2].textContent.split("/")[0], 
                            forecast.childNodes[2].textContent.split("/")[1],
                            document.querySelector(".weatherPageLocation h3"),
                            document.querySelector(".weatherPageHighlightsContainer h4")
                        ];  
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
                                weatherData, 
                                forecast, 
                                dayOfTheWeek, 
                                State.flag, 
                                minTemp, 
                                maxTemp, 
                                forecast.childNodes[0].textContent, 
                                labelElement, 
                                dayElement
                            ); 
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
        const [
            weatherDesc,
            iconElement,
            locationElement,
            dateElement, 
            tempElement,
            minMaxElement
        ] = [
            presentWeather.weather[0].description,
            document.querySelector(".weatherPageTempDigits i"),
            document.querySelector(".weatherPageLocation h1"),
            document.querySelector(".weatherPageLocation h3"),
            document.querySelector(".tempNum h1"),
            document.querySelector(".tempNum h6")
        ]; 
        Utilities.setIcon(iconElement, weatherDesc); 
        iconElement.className = `${iconElement.className} weather-icon`; 
        Utilities.setInfo(locationElement, dateElement, city); 
        Utilities.setTemp(
            tempElement, 
            minMaxElement, 
            State.metric, 
            presentWeather.main.temp, 
            presentWeather.main.temp_max, 
            presentWeather.main.temp_min
        ); 
        Utilities.setStats(
            State.windElement, 
            State.rainElement,  
            State.humidityElement, 
            State.cloudyElement, 
            State.flag, 
            presentWeather.wind.speed, 
            presentWeather, 
            presentWeather.main.humidity, 
            presentWeather.clouds.all
        ); 
        Utilities.setHighlights(
            State.feelsLikeElement, 
            State.visibilityElement, 
            State.sunriseElement, 
            State.sunsetElement, 
            presentWeather.main.feels_like, 
            presentWeather.visibility, 
            presentWeather.sys.sunrise, 
            presentWeather.sys.sunset
        ); 
        State.currentWeather = presentWeather; 
        console.log("Today's Weather:", presentWeather); 
    };

    static presentForecast = (
        presentForecast
    ) => {
        const [
            dailyInfo, 
            forecastElement,
            presentForecastLabelElement
        ] = [
            presentForecast.list, 
            document.querySelector(".dailyForecast"),
            document.querySelector(".dailyContainer h4")
        ];
        presentForecastLabelElement.textContent = State.language === State.languages.EN ? 
            "Today's Forecast" : State.englishToSpanishTranslation.TodayForecast;
        Utilities.setPresentForecast(forecastElement, dailyInfo); 
        WeatherPage.displayHourlyForecast(State.metric); 
        console.log("Daily Forecast:", presentForecast); 
    };

    static weeklyForecastWeather = (
        futureForecast
    ) => {
        const [
            weekInfo, 
            futureForecastElement, 
            futureForecastLabelElement 
        ] = [
            futureForecast.list, 
            document.querySelector(".forecastWeather"),
            document.querySelector(".forecastContainer h2")
        ];
            
        futureForecastLabelElement.textContent = State.language === State.languages.EN ? 
            "Weekly Forecast" : State.englishToSpanishTranslation.WeeklyForecast; 
        Utilities.setFutureForecast(futureForecastElement, weekInfo); 
        WeatherPage.displayWeeklyForecast(weekInfo); 
        console.log("Weekly Forecast:", futureForecast); 
    }; 

    // initializes data call for weather board and loads it onto the UI of the specific town requested 
    static callWeatherData = async(
        city, 
        state
    ) => {
        LocationQuery.doesLocationExist(city, state)
        .then(
            async(res) => {
                if (res) {
                    await LocationHandler.addToDb(city, state);
                    LocationHandler.saveLocations(city, state); 
                } else {
                    State.relPath === "WeatherPage.html" && WeatherPage.displayWeather(); 
                    console.log("Location already exists."); 
                }
            }
        ); 
    };

    // if track current location is given accessed, then generate data for the current location as requested 
    static getCurrentLocationSuccessCB = (
        pos
    ) => {
        const [lat, lon] = [pos.coords.latitude, pos.coords.longitude]; 
        WeatherRequest.requestCurrentLocation(lat, lon)
        .then(res => res.json())
        .then(weatherData => {
            State.relPath === "WeatherPage.html" && Utilities.clearWeather();
            State.cityStatePair = {
                "city": weatherData[0].name.toLowerCase(), 
                "state": weatherData[0].state.split(" ").map(word => word[0]).join("")}; 
            this.callWeatherData(State.cityStatePair["city"], State.cityStatePair["state"]); 
        })
        .catch(err => console.log(err)); 
    }; 

    static getCurrentLocation = () => {
        const currentLocationElement = document.querySelector(".fa-location-dot"); 
        currentLocationElement.addEventListener("click", () => {
            navigator.geolocation.getCurrentPosition(WeatherPage.getCurrentLocationSuccessCB, err => console.log(err)); 
            console.log("Requested current location.");  
        });
    }; 

    // searching option for data of weather for a specific inputted with regards to the format "City, State"
    static searchLocation = () => LocationHandler.inputLocation(".inputWrapper", ".weather-addLocation");z

    static displayWeather = () => {
        const toggledLocation = Utilities.getToggledLocation();
        if (toggledLocation && toggledLocation.length) {
            const [city, state] = toggledLocation.split(","); 
            LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                .then(
                    weatherData => {
                        const { 
                            presentWeather, 
                            presentForecastStats,
                            futureForecastStats, 
                        } = weatherData;
                        State.cityStatePair = {"city": city, "state": state}; 
                        this.presentWeather(presentWeather, city); 
                        this.presentForecast(presentForecastStats); 
                        this.weeklyForecastWeather(futureForecastStats); 
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

        State.metric = LocationStorage.getStorageItem("metric"); 
        State.timeConvention = LocationStorage.getStorageItem("timeConvention"); 
        State.language = LocationStorage.getStorageItem("language");

        WeatherPage.searchLocation(); 
        WeatherPage.getCurrentLocation(); 
        WeatherPage.displayWeather(); 
    }
);

export { WeatherPage }; 