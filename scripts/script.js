import { api_key, city, state } from "../config.js"; 

const setIcon = (weather, iconElement) => { 
    switch (weather) {
        case "clear sky": 
            iconElement.className = "wi wi-day-sunny"; 
            break; 
        case "sky is clear":
            iconElement.className = "wi wi-day-sunny"; 
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

const setTemp = (temp, maxTemp, minTemp) => {
    const tempElement = document.querySelector('.tempNum h1'); 
    const minMaxElement = document.querySelector('.tempNum h6'); 

    tempElement.textContent = Math.round(temp); 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + ` / ` + `${Math.round(minTemp)}`; 
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

const setWeekly = (weekInfo) => {
    const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday", "Sunday"];

    const weekElement = document.querySelector(".forecastWeather"); 

    weekInfo.forEach((daily) => {
        const div = document.createElement("div"); 
    
        const icon = document.createElement("i"); 
        const firsth4 = document.createElement("h4"); 
        const secondh4 = document.createElement("h4");
        
        div.className = "dailyForecast"; 
        setIcon(daily.weather[0].description, icon); 
        firsth4.textContent = `${Days[new Date(daily.dt * 1000).getDay()]}`; 
        secondh4.textContent = `${Math.round(daily.temp.max)} / ${Math.round(daily.temp.min)}`;
        
        weekElement.appendChild(div); 
        div.appendChild(firsth4); 
        div.appendChild(icon); 
        div.appendChild(secondh4); 
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
        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${metric}`;

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
            setTemp(data.main.temp, data.main.temp_max, data.main.temp_min); 
            setStats(data.wind.speed, data, data.main.humidity, data.clouds.all); 

        }).catch(error => console.log(error)); 

    }).catch(error => console.log(error));
};

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
// weeklyForecastWeather(); 