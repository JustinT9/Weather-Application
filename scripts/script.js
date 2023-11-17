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
    const tempElement = document.querySelector('.temp h1'); 
    const minMaxElement = document.querySelector('.temp h6'); 

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

    const weekElement = document.querySelector(".week"); 

    weekInfo.forEach((daily, idx) => {
        const div = document.createElement("div"); 
    
        const icon = document.createElement("i"); 
        const h2 = document.createElement("h2"); 
        const h4 = document.createElement("h4"); 
        
        div.className = "daily"; 
        setIcon(daily.weather[0].description, icon); 
        h2.textContent = `${Math.round(daily.temp.max)} / ${Math.round(daily.temp.min)}`;
        h4.textContent = `${Days[new Date(daily.dt * 1000).getDay()]}`; 
        
        weekElement.appendChild(div); 
        div.appendChild(icon); 
        div.appendChild(h2); 
        div.appendChild(h4); 
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

const lst = [
    {
        "dt": 1700236800,
        "sunrise": 1700221584,
        "sunset": 1700257130,
        "temp": {
            "day": 60.94,
            "min": 47.44,
            "max": 66.2,
            "night": 56.34,
            "eve": 64,
            "morn": 47.48
        },
        "feels_like": {
            "day": 59.99,
            "night": 55.81,
            "eve": 63.07,
            "morn": 45.36
        },
        "pressure": 1016,
        "humidity": 69,
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04d"
            }
        ],
        "speed": 10.42,
        "deg": 204,
        "gust": 25.32,
        "clouds": 88,
        "pop": 0
    },
    {
        "dt": 1700323200,
        "sunrise": 1700308055,
        "sunset": 1700343485,
        "temp": {
            "day": 52.48,
            "min": 42.1,
            "max": 56.03,
            "night": 42.1,
            "eve": 47.79,
            "morn": 54.68
        },
        "feels_like": {
            "day": 50.07,
            "night": 36.84,
            "eve": 42.76,
            "morn": 54.27
        },
        "pressure": 1008,
        "humidity": 56,
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04d"
            }
        ],
        "speed": 14.99,
        "deg": 330,
        "gust": 27.47,
        "clouds": 94,
        "pop": 0.14
    },
    {
        "dt": 1700409600,
        "sunrise": 1700394525,
        "sunset": 1700429842,
        "temp": {
            "day": 48.67,
            "min": 38.73,
            "max": 53.02,
            "night": 43.47,
            "eve": 48.97,
            "morn": 39.54
        },
        "feels_like": {
            "day": 44.71,
            "night": 39.15,
            "eve": 45.54,
            "morn": 35.53
        },
        "pressure": 1013,
        "humidity": 46,
        "weather": [
            {
                "id": 800,
                "main": "Clear",
                "description": "sky is clear",
                "icon": "01d"
            }
        ],
        "speed": 10.36,
        "deg": 267,
        "gust": 23.22,
        "clouds": 0,
        "pop": 0
    },
    {
        "dt": 1700496000,
        "sunrise": 1700480995,
        "sunset": 1700516201,
        "temp": {
            "day": 40.01,
            "min": 35.89,
            "max": 44.28,
            "night": 37.31,
            "eve": 43.38,
            "morn": 37.35
        },
        "feels_like": {
            "day": 34.09,
            "night": 32.4,
            "eve": 38.75,
            "morn": 31.89
        },
        "pressure": 1025,
        "humidity": 41,
        "weather": [
            {
                "id": 802,
                "main": "Clouds",
                "description": "scattered clouds",
                "icon": "03d"
            }
        ],
        "speed": 9.04,
        "deg": 347,
        "gust": 19.04,
        "clouds": 29,
        "pop": 0
    },
    {
        "dt": 1700582400,
        "sunrise": 1700567464,
        "sunset": 1700602562,
        "temp": {
            "day": 38.41,
            "min": 34.97,
            "max": 40.39,
            "night": 39.34,
            "eve": 36.86,
            "morn": 35.22
        },
        "feels_like": {
            "day": 33.15,
            "night": 33.87,
            "eve": 30.96,
            "morn": 29.82
        },
        "pressure": 1029,
        "humidity": 41,
        "weather": [
            {
                "id": 501,
                "main": "Rain",
                "description": "moderate rain",
                "icon": "10d"
            }
        ],
        "speed": 7.85,
        "deg": 130,
        "gust": 19.1,
        "clouds": 100,
        "pop": 1,
        "rain": 4.66
    },
    {
        "dt": 1700668800,
        "sunrise": 1700653933,
        "sunset": 1700688925,
        "temp": {
            "day": 42.8,
            "min": 36.99,
            "max": 44.89,
            "night": 36.99,
            "eve": 40.96,
            "morn": 43.75
        },
        "feels_like": {
            "day": 36.77,
            "night": 30.49,
            "eve": 34.16,
            "morn": 43.75
        },
        "pressure": 1011,
        "humidity": 86,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "light rain",
                "icon": "10d"
            }
        ],
        "speed": 12.55,
        "deg": 327,
        "gust": 25.37,
        "clouds": 100,
        "pop": 1,
        "rain": 5.42
    },
    {
        "dt": 1700755200,
        "sunrise": 1700740401,
        "sunset": 1700775290,
        "temp": {
            "day": 40.08,
            "min": 33.69,
            "max": 46.36,
            "night": 40.84,
            "eve": 46.24,
            "morn": 34.23
        },
        "feels_like": {
            "day": 35.55,
            "night": 37.27,
            "eve": 42.6,
            "morn": 29.1
        },
        "pressure": 1017,
        "humidity": 58,
        "weather": [
            {
                "id": 803,
                "main": "Clouds",
                "description": "broken clouds",
                "icon": "04d"
            }
        ],
        "speed": 8.08,
        "deg": 249,
        "gust": 21.88,
        "clouds": 71,
        "pop": 0
    },
    {
        "dt": 1700841600,
        "sunrise": 1700826868,
        "sunset": 1700861657,
        "temp": {
            "day": 45.39,
            "min": 38.88,
            "max": 50.85,
            "night": 46.04,
            "eve": 49.26,
            "morn": 39.24
        },
        "feels_like": {
            "day": 42.73,
            "night": 43.23,
            "eve": 49.26,
            "morn": 36.25
        },
        "pressure": 1022,
        "humidity": 60,
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04d"
            }
        ],
        "speed": 5.53,
        "deg": 74,
        "gust": 17.9,
        "clouds": 86,
        "pop": 0
    }
]

// currentWeather(); 
// weeklyForecastWeather(); 