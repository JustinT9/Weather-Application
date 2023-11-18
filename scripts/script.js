import { api_key, city, state } from "../config.js"; 

const setIcon = (weather, iconElement) => { 
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
            break; 
        case "scattered clouds": 
            iconElement.className = "wi wi-cloud"; 
            break; 
        case "broken clouds": 
            iconElement.className = "wi wi-cloudy"; 
            break; 
        case "overcast clouds": 
            iconElement.className = "wi wi-cloudy"; 
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
        case "thunderstorm": 
            iconElement.className = "wi wi-thunderstorm"; 
            break; 
        case "snow": 
            iconElement.className = "wi wi-snow";
            break; 
        case "mist": 
            iconElement.className = "wi wi-fog"; 
    }
};

const setInfo = (city, state) => {
    const Months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
    const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday", "Sunday"];

    const locElement = document.querySelector('h1'); 
    const dateElement = document.querySelector('h3'); 
    const date = new Date(Date.now()); 
    const day = date.getDate().toString()[date.getDate().toString().length - 1]; 

    locElement.textContent = `${city}, ${state}`; 
    dateElement.textContent = `${Days[date.getDay()]}, ${Months[date.getMonth()]} ${date.getDate()}` + 
    (day === '1' ? 'st' : (day === 2 ? 'nd' : (day === 3 ? 'rd' : 'th'))); 
}; 

const setTemp = (metric, temp, maxTemp, minTemp) => {
    const tempElement = document.querySelector('.tempNum h1'); 
    const minMaxElement = document.querySelector('.tempNum h6'); 

    (metric === "imperial") ? 
    tempElement.textContent = Math.round(temp) + "\u00b0": 
    tempElement.textContent = Math.round(temp) + "\u00b0";
    
    (metric === "imperial") ? 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + `${Math.round(minTemp)}`+ "\u00b0" : 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + `${Math.round(minTemp)}` + "\u00b0";  
}; 

const setStats = (windSpeed, data, humidity, cloudiness) => {  
    const windElement = document.querySelector(".first"); 
    const rainElement = document.querySelector('.second'); 
    const humidityElement = document.querySelector(".third");
    const precipitation = (data.rain ? data.rain : (data.snow ? data.snow : null)); 
    const cloudyElement = document.querySelector(".fourth"); 

    windElement.textContent = `${Math.round(windSpeed)} mph`; 
    humidityElement.textContent = `${humidity}%`; 
    rainElement.textContent = (precipitation ? `${precipitation["1h"]}mm` : `0 mm`);
    cloudyElement.textContent = `${cloudiness}%`; 
}; 

const setCurrent = (dailyInfo, metric) => {
    const forecastElement = document.querySelector('.currentForecast'); 

    dailyInfo.forEach((info) => {
        const hourForecast = document.createElement('div'); 
        const timeElement = document.createElement('h4'); 
        const iconElement = document.createElement('i'); 
        const tempElement = document.createElement('h4'); 

        const time = new Date(info.dt * 1000); 

        hourForecast.className = "hourForecast"; 
        timeElement.textContent = (time.toLocaleTimeString().length % 2 === 0) ? 
        (`${time.toLocaleTimeString().substring(0, 4)} ${time.toLocaleTimeString().substring(8, time.toLocaleTimeString().length)}`) : 
        (`${time.toLocaleTimeString().substring(0, 5)} ${time.toLocaleTimeString().substring(9, time.toLocaleTimeString().length)}`); 

        setIcon(info.weather[0].description, iconElement); 
        (metric === "imperial") ? 
        tempElement.textContent = Math.round(info.main.temp) + "\u00b0" + "F" : 
        tempElement.textContent = Math.round(info.main.temp) + "\u00b0" + "C"; 

        hourForecast.appendChild(timeElement); 
        hourForecast.appendChild(iconElement); 
        hourForecast.appendChild(tempElement);
        forecastElement.appendChild(hourForecast); 
    }); 
}

const setWeekly = (weekInfo) => {
    const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday", "Sunday"];

    const dayElement = document.querySelector(".forecastDay"); 
    const iconElement = document.querySelector(".forecastIcon"); 
    const tempsElement = document.querySelector(".forecastTemps"); 

    weekInfo.forEach((daily) => {
        const day = document.createElement("h4"); 
        const icon = document.createElement("i"); 
        const temp = document.createElement("h4");
        
        day.textContent = `${Days[new Date(daily.dt * 1000).getDay()]}`; 
        temp.textContent = `${Math.round(daily.temp.max) + "\u00b0"} / ${Math.round(daily.temp.min) + "\u00b0"}`;
        setIcon(daily.weather[0].description, icon); 

        dayElement.appendChild(day);
        iconElement.appendChild(icon);
        tempsElement.appendChild(temp); 
    }); 
}; 

const currentWeather = () => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/";   
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${key}`;
     
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
        const newCity = data[0].name; 
        const newState = data[0].state; 
        console.log(lat, lon); 

        // fahrenheit
        const metric = 'imperial';
        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${metric}&cnt=7`;

        const weather = fetch(proxy + weatherEndpoint, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            return res.json(); 

        }).then(data => { 
            const iconElement = document.querySelector(".main-stats i"); 

            setIcon(data.weather.description, iconElement); 
            setInfo(newCity, newState); 
            setTemp(metric, data.main.temp, data.main.temp_max, data.main.temp_min); 
            setStats(data.wind.speed, data, data.main.humidity, data.clouds.all); 

        }).catch(error => console.log(error)); 

    }).catch(error => console.log(error));
};

const currentForecast = () => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/"; 
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${key}`;

    const location = fetch(proxy + locEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    }).then(res => {
        return res.json(); 
    }).then(data => {
        const lat = data[0].lat; 
        const lon = data[0].lon; 

        const metric = "imperial";  
        const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${api_key}&cnt=7&units=${metric}`; 
        
        const forecast = fetch(proxy + forecastEndpoint, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json", 
            }
        }).then(res => {
            return res.json(); 
        }).then(data => {
            const dailyInfo = data.list

            setCurrent(dailyInfo, metric); 
            
        }).catch(error => console.log(error));  

    }).catch(error => console.log(error)); 

}

const weeklyForecastWeather = () => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/";   
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${key}`;

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
        console.log(lat, lon); 

        // fahrenheit
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
    
    }).catch(error => console.log(error));  
}; 

// currentWeather(); 
// currentForecast(); 
// weeklyForecastWeather(); 