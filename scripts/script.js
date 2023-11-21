import { api_key } from "../config.js"; 
import { todayWeather, todayForecast, weekForecast } from "../mockdata.js"; 

const setIcon = (weather, iconElement) => { 
    console.log(weather, iconElement); 
    switch (weather) {
        case "clear sky": 
            iconElement.className = "wi wi-day-sunny";
            iconElement.style.color = "yellow";  
            break; 
        case "sky is clear":
            iconElement.className = "wi wi-day-sunny"; 
            iconElement.style.color = "yellow"; 
            break; 
        case "few clouds": 
            iconElement.className = "wi wi-day-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "scattered clouds": 
            iconElement.className = "wi wi-cloud"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "broken clouds": 
            iconElement.className = "wi wi-cloudy"; 
            iconElement.style.color = "#c7c4bf"; 
            break; 
        case "overcast clouds": 
            iconElement.className = "wi wi-cloudy"; 
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

const setInfo = (city) => {
    const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday"];

    const container     = document.querySelector('.currentGeo');  
    const locElement    = document.createElement('h1'); 
    const dateElement   = document.createElement('h3'); 
    const date          = new Date(Date.now()); 

    locElement.textContent  = `${city}`; 
    dateElement.textContent = (date.toLocaleTimeString().length % 2 === 0) ? 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
    ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
    (`${Days[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
    ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);
    
    container.appendChild(locElement); 
    container.appendChild(dateElement);
}; 

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

const setStats = (windSpeed, data, humidity, cloudiness) => {  
    const windElement     = document.querySelector(".windSpeed"); 
    const rainElement     = document.querySelector('.rainVolume'); 
    const humidityElement = document.querySelector(".humidity");
    const precipitation   = (data.rain ? data.rain : (data.snow ? data.snow : null)); 
    const cloudyElement   = document.querySelector(".cloudiness"); 

    windElement.textContent     = `${Math.round(windSpeed)} mph`; 
    humidityElement.textContent = `${humidity}%`; 
    rainElement.textContent     = (precipitation ? `${precipitation["1h"]}mm` : `0 mm`);
    cloudyElement.textContent   = `${cloudiness}%`; 
}; 

const setDaily = (dailyInfo) => {
    const forecastElement = document.querySelector('.dailyForecast'); 

    dailyInfo.forEach((info) => {
        const hourlyForecast = document.createElement('div'); 
        const iconElement    = document.createElement('i'); 
        const timeElement    = document.createElement('h4'); 
        const tempElement    = document.createElement('h4'); 

        const time = new Date(info.dt * 1000); 
        const description = info.weather[0].description; 

        setIcon(description, iconElement); 
        hourlyForecast.className = "hourlyForecast"; 
        timeElement.textContent = (time.toLocaleTimeString().length % 2 === 0) ? 
        (`${time.toLocaleTimeString().substring(0, 4)} 
        ${time.toLocaleTimeString().substring(8, time.toLocaleTimeString().length)}`) : 
        (`${time.toLocaleTimeString().substring(0, 5)} 
        ${time.toLocaleTimeString().substring(9, time.toLocaleTimeString().length)}`); 
        tempElement.textContent = Math.round(info.main.temp) + "\u00b0"; 

        hourlyForecast.appendChild(timeElement); 
        hourlyForecast.appendChild(iconElement); 
        hourlyForecast.appendChild(tempElement);
        forecastElement.appendChild(hourlyForecast); 
    }); 
}

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

        setIcon(description, icon); 
        (idx === 0) ? day.textContent = "Today" :  
        (day.textContent = `${Days[new Date(daily.dt * 1000).getDay()]}`);
        temp.textContent = `${Math.round(daily.temp.max) + "\u00b0"} / 
                            ${Math.round(daily.temp.min) + "\u00b0"}`;

        container.appendChild(day);
        container.appendChild(icon);
        container.appendChild(temp);
        forecastElement.appendChild(container); 
    }); 
}; 

const currentWeather = (key, proxy, lat, lon) => {
    const metric = 'imperial';
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${metric}&cnt=7`;

    const weather = fetch(proxy + weatherEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        return res.json(); 

    }).then(data => { 
        const iconElement = document.querySelector(".currentTempInfo i"); 

        setIcon(data.weather[0].description, iconElement); 
        iconElement.className = `${iconElement.className} weather-icon`; 

        setInfo("Scotch Plains"); 
        setTemp(metric, data.main.temp, data.main.temp_max, data.main.temp_min); 
        setStats(data.wind.speed, data, data.main.humidity, data.clouds.all); 

    }).catch(error => console.log(error)); 
};

const dailyForecast = (key, proxy, lat, lon) => {
    const metric = "imperial";  
    const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${key}&cnt=7&units=${metric}`; 
    
    const forecast = fetch(proxy + forecastEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const dailyInfo = data.list

        setDaily(dailyInfo); 
        
    }).catch(error => console.log(error));  
}

const weeklyForecastWeather = (key, proxy, lat, lon) => {
    const metric = 'imperial';
    const forecastEndpoint = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${key}&units=${metric}`;
    
    const forecast = fetch(proxy + forecastEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
            }
        }).then(res => {
            return res.json(); 
    }).then(data => {
        const weekInfo = data.list; 
        setWeekly(weekInfo); 

    }).catch(error => console.log(error)); 
}; 

const callWeatherData = () => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/";   
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=Scotch Plains, NJ,US&appid=${key}`;

    const location = fetch(proxy + locEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const lat = data[0].lat; 
        const lon = data[0].lon; 
    
        // currentWeather(key, proxy, lat, lon); 
        // dailyForecast(key, proxy, lat, lon); 
        weeklyForecastWeather(key, proxy, lat, lon); 

    }).catch(error => console.log(error)); 
}; 


const mock = () => {
    const iconElement = document.querySelector(".currentTempInfo i"); 
    setIcon(todayWeather.weather[0].description, iconElement); 
    iconElement.className = `${iconElement.className} weather-icon`; 

    setInfo(todayWeather.name); 
    setTemp("imperial", todayWeather.main.temp, todayWeather.main.temp_max, todayWeather.main.temp_min); 
    setStats(todayWeather.wind.speed, todayWeather, todayWeather.main.humidity, todayWeather.clouds.all); 
    setDaily(todayForecast); 
    setWeekly(weekForecast);
}; 

mock(); 

