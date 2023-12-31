import { api_key } from "../config.js"; 
import { todayWeather, todayForecast, weekForecast } from "../mockdata.js"; 

let today;

// sets up the icon representing the weather 
const setIcon = (iconElement, weather) => { 
    switch (weather) {
        case "clear sky": 
            iconElement.className   = "wi wi-day-sunny";
            iconElement.style.color = "yellow";  
            break; 
        case "sky is clear":
            iconElement.className   = "wi wi-day-sunny"; 
            iconElement.style.color = "yellow"; 
            break; 
        case "few clouds": 
            iconElement.className   = "wi wi-day-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "scattered clouds": 
            iconElement.className   = "wi wi-cloud"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "broken clouds": 
            iconElement.className   = "wi wi-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "overcast clouds": 
            iconElement.className   = "wi wi-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "shower rain":
            iconElement.className = "wi wi-day-rain"; 
            break; 
        case "rain":
            iconElement.className = "wi wi-day-thunderstorm"; 
            break; 
        case "moderate rain": 
            iconElement.className = "wi wi-rain"; 
            break; 
        case "light rain":
            iconElement.className = "wi wi-raindrops"; 
            break; 
        case "heavy intensity rain": 
            iconElement.className = "wi wi-showers"; 
            break; 
        case "thunderstorm": 
            iconElement.className = "wi wi-thunderstorm"; 
            break; 
        case "snow": 
            iconElement.className = "wi wi-snow";
            break; 
        case "mist": 
            iconElement.className = "wi wi-fog"; 
    };
};

// sets up time and location of the weather 
const setInfo = (city) => {
    const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday"];
    const container   = document.querySelector('.currentGeo');  
    const locElement  = document.createElement('h1'); 
    const dateElement = document.createElement('h3'); 
    const date        = new Date(Date.now()); 

    locElement.textContent  = `${city}`; 
    dateElement.textContent = (date.toLocaleTimeString().length % 2 === 0) ? 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
    ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
    ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);

    container.appendChild(locElement); 
    container.appendChild(dateElement);
}; 

// sets up main stats regarding today's weather 
const setTemp = (metric, temp, maxTemp, minTemp) => {
    const container     = document.querySelector(".tempNum"); 
    const tempElement   = document.createElement('h1'); 
    const minMaxElement = document.createElement('h6'); 

    (metric === "imperial") ? 
    tempElement.textContent = Math.round(temp) + "\u00b0" + "F": 
    tempElement.textContent = Math.round(temp) + "\u00b0" + "C";
    
    (metric === "imperial") ? 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + 
    `${Math.round(minTemp)}`+ "\u00b0" : 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + 
    `${Math.round(minTemp)}` + "\u00b0";  

    container.appendChild(tempElement); 
    container.appendChild(minMaxElement); 
}; 

// sets up additional climate statistics for the current day 
const setStats = (type, windSpeed, data, humidity, cloudiness) => {  
    const windElement     = document.querySelector(".windSpeed"); 
    const rainElement     = document.querySelector('.rainVolume'); 
    const humidityElement = document.querySelector(".humidity");
    const precipitation   = (data.rain ? data.rain : (data.snow ? data.snow : null)); 
    const cloudyElement   = document.querySelector(".cloudiness"); 

    windElement.textContent     = `${Math.round(windSpeed)} mph`; 
    humidityElement.textContent = `${humidity}%`; 
    rainElement.textContent     = ((type === "daily" && precipitation) ? `${precipitation["1h"]}mm` : 
                                   ((type === "week" && precipitation) ? `${data.rain} mm` : `0 mm`));
    cloudyElement.textContent   = `${cloudiness}%`; 
}; 

// sets up climate highlights 
const setHighlights = (feelsLike, visibility, sunriseTime, sunsetTime) => {
    const feelsElement   = document.querySelector(".feelslike"); 
    const visibleElement = document.querySelector(".visible");  
    const sunriseElement = document.querySelector(".sunrise"); 
    const sunsetElement  = document.querySelector(".sunset"); 

    const feelsInfo      = document.createElement("h4"); 
    const visibleInfo    = document.createElement("h4"); 
    const sunriseInfo    = document.createElement("h4"); 
    const sunsetInfo     = document.createElement("h4"); 

    const sunrise        = new Date(sunriseTime * 1000).toLocaleTimeString(); 
    const sunset         = new Date(sunsetTime * 1000).toLocaleTimeString(); 

    feelsInfo.textContent   = `${Math.round(feelsLike)}` + "\u00b0"; 
    visibleInfo.textContent = `${((visibility / 1000) / 1.609).toFixed(1)} mi`; 
    sunriseInfo.textContent = (sunrise.length % 2 === 0) ? 
    (`${sunrise.substring(0, 4)} ${sunrise.substring(8, sunrise.length)}`) : 
    (`${sunrise.substring(0, 5)} ${sunrise.substring(9, sunrise.length)}`);
    sunsetInfo.textContent  = (sunset.length % 2 === 0) ? 
    (`${sunset.substring(0, 4)} ${sunset.substring(8, sunset.length)}`) : 
    (`${sunset.substring(0, 5)} ${sunset.substring(9, sunset.length)}`);

    feelsElement.appendChild(feelsInfo);
    visibleElement.appendChild(visibleInfo); 
    sunriseElement.appendChild(sunriseInfo); 
    sunsetElement.appendChild(sunsetInfo); 
}; 

// sets up the daily forecast 
const setDaily = (dailyInfo) => {
    const forecastElement = document.querySelector('.dailyForecast'); 

    dailyInfo.forEach((info, i) => {
        const hourlyForecast = document.createElement('div'); 
        const iconElement    = document.createElement('i'); 
        const timeElement    = document.createElement('h4'); 
        const tempElement    = document.createElement('h4'); 

        const time        = new Date(info.dt * 1000); 
        const description = info.weather[0].description; 

        setIcon(iconElement, description); 
        hourlyForecast.className = "hourlyForecast"; 
        if (i === 0) {
            timeElement.textContent = "Now"; 
        } else {
            timeElement.textContent  = (time.toLocaleTimeString().length % 2 === 0) ? 
            (`${time.toLocaleTimeString().substring(0, 4)} 
            ${time.toLocaleTimeString().substring(8, time.toLocaleTimeString().length)}`) : 
            (`${time.toLocaleTimeString().substring(0, 5)} 
            ${time.toLocaleTimeString().substring(9, time.toLocaleTimeString().length)}`); 
        } tempElement.textContent = Math.round(info.main.temp) + "\u00b0"; 
        hourlyForecast.appendChild(timeElement); 
        hourlyForecast.appendChild(iconElement); 
        hourlyForecast.appendChild(tempElement);
        forecastElement.appendChild(hourlyForecast); 
    }); 
}; 

// sets up the weekly forecast weather 
const setWeekly = (weekInfo) => {
    const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday"];

    const forecastElement = document.querySelector(".forecastWeather"); 

    weekInfo.forEach((daily, idx) => {
        const container   = document.createElement("div");
        const icon        = document.createElement("i"); 
        const day         = document.createElement("h4"); 
        const temp        = document.createElement("h4");
        const description = daily.weather[0].description; 

        container.className = "forecastDay"; 
        temp.className      = "forecastTemp"; 

        setIcon(icon, description); 
        (idx === 0) ? day.textContent = "Today" :  
        (day.textContent = `${Days[new Date(daily.dt * 1000).getDay()]}`);
        temp.textContent = `${Math.round(daily.temp.max) + "\u00b0"} / ${Math.round(daily.temp.min) + "\u00b0"}`;

        container.appendChild(day);
        container.appendChild(icon);
        container.appendChild(temp);
        forecastElement.appendChild(container); 
    }); 
}; 

// requests data from openweatherAPI for current day's weather and climate 
const currentWeather = (key, proxy, lat, lon, city) => {
    const metric = 'imperial';
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${metric}&cnt=7`;

    fetch(proxy + weatherEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        return res.json(); 

    }).then(data => { 
        const iconElement = document.querySelector(".currentTempInfo i"); 
        const description = data.weather[0].description; 
        const flag        = "daily";  

        setInfo(city); 
        setIcon(iconElement, description); 
        setTemp(metric, data.main.temp, data.main.temp_max, data.main.temp_min); 
        setStats(flag, data.wind.speed, data, data.main.humidity, data.clouds.all); 
        setHighlights(data.main.feels_like, data.visibility, data.sys.sunrise, data.sys.sunset); 

        iconElement.className = `${iconElement.className} weather-icon`; 
        today = data; 

    }).catch(error => console.log(error)); 
};

// requests data from openweatherAPI for forecast of today's weather for each hour 
const dailyForecast = (key, proxy, lat, lon) => {
    const metric = "imperial";  
    const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${key}&cnt=7&units=${metric}`; 
    
    fetch(proxy + forecastEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const dailyInfo = data.list;

        setDaily(dailyInfo); 
        
    }).catch(error => console.log(error));  
};

// requests data from openweatherAPI for forecast of this week's weather 
const weeklyForecastWeather = (key, proxy, lat, lon) => {
    const metric = 'imperial';
    const forecastEndpoint = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${key}&units=${metric}`;
    
    fetch(proxy + forecastEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
            }
        }).then(res => {
            return res.json(); 
    }).then(data => {
        const weekInfo = data.list; 

        setWeekly(weekInfo); 
        showWeeklyForecast(weekInfo); 

        console.log("weekly forecast request"); 

    }).catch(error => console.log(error)); 
}; 

// initializes data call for weather board and loads it onto the UI of the specific town requested 
const callWeatherData = (city, state) => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}, ${state},US&appid=${key}`;

    fetch(proxy + locEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const lat = data[0].lat; 
        const lon = data[0].lon; 

        // request data for specific statistics 
        currentWeather(key, proxy, lat, lon, city); 
        dailyForecast(key, proxy, lat, lon); 
        weeklyForecastWeather(key, proxy, lat, lon); 

    }).catch(error => console.log(error)); 
}; 

// searching option for data of weather for a specific inputted with regards to the format "City, State"
const searchLocation = () => {
    const formElement = document.querySelector('.inputWrapper'); 

    formElement.addEventListener('submit', (e) => {
        const locationValue = document.querySelector(".addLocation").value; 
        const pair = {"city": locationValue.split(",")[0], "state": locationValue.split(",")[1].trim()}; 

        e.preventDefault(); 

        clear(); 
        callWeatherData(pair["city"], pair["state"]); 
        document.querySelector(".addLocation").value = ""; 
    }); 
}; 

// must clear data before if there was any so the UI does not get conflicted 
const clear = () => {
    const geoElement     = document.querySelector(".currentGeo"); 
    const tempElement    = document.querySelector(".tempNum"); 
    const feelsElement   = document.querySelector(".feelslike"); 
    const visibleElement = document.querySelector(".visible"); 
    const sunriseElement = document.querySelector(".sunrise"); 
    const sunsetElement  = document.querySelector(".sunset"); 
    const dailyForecast  = document.querySelector(".dailyForecast"); 
    const weeklyForecast = document.querySelector(".forecastWeather"); 

    while (geoElement.firstChild || tempElement.firstChild || 
        dailyForecast.firstChild || weeklyForecast.firstChild) {
        if (geoElement.firstChild) geoElement.firstChild.remove();
         
        if (tempElement.firstChild) tempElement.firstChild.remove(); 
        
        if (dailyForecast.firstChild) dailyForecast.firstChild.remove(); 
        
        if (weeklyForecast.firstChild) weeklyForecast.firstChild.remove(); 
    }

    feelsElement.childNodes.forEach((ele) => {
        if (ele.tagName === "H4") ele.remove();  
    })

    visibleElement.childNodes.forEach((ele) => {
        if (ele.tagName === "H4") ele.remove(); 
    })
    
    sunriseElement.childNodes.forEach((ele) => {
        if (ele.tagName === "H4") ele.remove(); 
    })

    sunsetElement.childNodes.forEach((ele) => {
        if (ele.tagName === "H4") ele.remove(); 
    })
}; 

// to allow the UI display the projected weather for the hour within the day 
const showHourlyForecast = (data) => {
    const dailyContainer = document.querySelector(".dailyForecast");

    dailyContainer.addEventListener("click", () => {
        const tempElement = document.querySelector(".tempNum h1"); 

        dailyContainer.childNodes.forEach((forecast, i) => {
            forecast.addEventListener("click", () => {
                const newTempElement = forecast.childNodes[2].textContent; 
                tempElement.textContent = newTempElement + "F";
            });
        }); 
    }); 
}; 

// to allow the UI display the projected weather for the day within the week 
const showWeeklyForecast = (data) => {
    const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
                  "Saturday"];
    const forecastElement = document.querySelector(".forecastWeather"); 

    forecastElement.addEventListener("click", () => {
        const dayElement        = document.querySelector(".currentGeo h3"); 
        const iconElement       = document.querySelector(".currentTempInfo i");  
        const tempElement       = document.querySelector(".tempNum h1"); 
        const minMaxElement     = document.querySelector(".tempNum h6");  
        
        const feelsLikeElement  = document.querySelector(".feelslike h4");
        const visibilityElement = document.querySelector(".visible h4"); 
        const sunriseElement    = document.querySelector(".sunrise h4");
        const sunsetElement     = document.querySelector(".sunset h4");
        
        forecastElement.childNodes.forEach((forecast, i) => {
            forecast.addEventListener("click", () => {
                const max = forecast.childNodes[2].textContent.split("/")[0];
                const min = forecast.childNodes[2].textContent.split("/")[1];  

                if (forecast.childNodes[0].textContent === "Today") {
                    const date                = new Date(Date.now());                                                                                     
                    const flag                = "daily";  
                    const sunrise             = new Date(today.sys.sunrise * 1000).toLocaleTimeString(); 
                    const sunset              = new Date(today.sys.sunset * 1000).toLocaleTimeString(); 
                    
                    // const sunrise             = new Date(todayWeather.sunrise * 1000).toLocaleTimeString(); 
                    // const sunset              = new Date(todayWeather.sunset * 1000).toLocaleTimeString(); 

                    dayElement.textContent    = (date.toLocaleTimeString().length % 2 === 0) ? 
                    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
                    ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
                    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
                    ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);
                    tempElement.textContent   =  `${Math.round(today.main.temp)}` + "\u00b0" + "F"; 
                    minMaxElement.textContent = `${Math.round(today.main.temp_max)}` + "\u00b0" + " / " + `${Math.round(today.main.temp_min)}` + "\u00b0";   
                    setStats(flag, today.wind.speed, today, today.main.humidity, today.clouds.all);

                    feelsLikeElement.textContent   = `${Math.round(today.main.feels_like)}` + "\u00b0"; 
                    visibilityElement.textContent  = `${((today.visibility / 1000) / 1.609).toFixed(1)} mi`; 
                    sunriseElement.textContent = (sunrise.length % 2 === 0) ? 
                    (`${sunrise.substring(0, 4)} ${sunrise.substring(8, sunrise.length)}`) : 
                    (`${sunrise.substring(0, 5)} ${sunrise.substring(9, sunrise.length)}`);
                    sunsetElement.textContent  = (sunset.length % 2 === 0) ? 
                    (`${sunset.substring(0, 4)} ${sunset.substring(8, sunset.length)}`) : 
                    (`${sunset.substring(0, 5)} ${sunset.substring(9, sunset.length)}`);

                    console.log(today); 
                } else {
                    const flag       = "week"; 
                    const sunrise = new Date(data[i-1].sunrise * 1000).toLocaleTimeString(); 
                    const sunset  = new Date(data[i-1].sunset * 1000).toLocaleTimeString(); 
                     
                    // const sunrise = new Date(weekForecast[i-1].sunrise * 1000).toLocaleTimeString(); 
                    // const sunset  = new Date(weekForecast[i-1].sunset * 1000).toLocaleTimeString(); 

                    dayElement.textContent    = forecast.childNodes[0].textContent; 
                    tempElement.textContent   = max.trim() + "F";
                    minMaxElement.textContent = `${max}/${min}`; 
                    setStats(flag, data[i-1].speed, data[i-1], data[i-1].humidity, data[i-1].clouds); 

                    feelsLikeElement.textContent  = `${Math.round((data[i-1].feels_like["day"] + 
                    data[i-1].feels_like["night"] + data[i-1].feels_like["eve"] + 
                    data[i-1].feels_like["morn"]) / 4)}` + "\u00b0";
                    visibilityElement.textContent = "???";  
                    sunriseElement.textContent = (sunrise.length % 2 === 0) ? 
                    (`${sunrise.substring(0, 4)} ${sunrise.substring(8, sunrise.length)}`) : 
                    (`${sunrise.substring(0, 5)} ${sunrise.substring(9, sunrise.length)}`);
                    sunsetElement.textContent  = (sunset.length % 2 === 0) ? 
                    (`${sunset.substring(0, 4)} ${sunset.substring(8, sunset.length)}`) : 
                    (`${sunset.substring(0, 5)} ${sunset.substring(9, sunset.length)}`);
                }

                iconElement.className     = `${forecast.childNodes[1].className} weather-icon`;   
                iconElement.style.color   = forecast.childNodes[1].style.color; 
            }); 
        }); 
    }); 
}; 

const mock = () => {
    const iconElement = document.querySelector(".currentTempInfo i"); 
    const description = todayWeather.weather[0].description; 
    const metric      = "imperial"; 
    const flag        = "daily"; 

    setIcon(iconElement, description); iconElement.className = `${iconElement.className} weather-icon`;
    setInfo(todayWeather.name); 
    setTemp(metric, todayWeather.main.temp, todayWeather.main.temp_max, todayWeather.main.temp_min); 
    setStats(flag, todayWeather.wind.speed, todayWeather, todayWeather.main.humidity, todayWeather.clouds.all); 
    setHighlights(todayWeather.main.feels_like, todayWeather.visibility, todayWeather.sys.sunrise, todayWeather.sys.sunset);
    setDaily(todayForecast); 
    setWeekly(weekForecast);
    showHourlyForecast(todayForecast); 
    showWeeklyForecast(weekForecast); 
}; 

mock(); 
searchLocation(); 


