import { api_key } from "./config.js";
import { GLOBALSTATE } from "./state.js";

const requestCurrentCoordinates = (city, state) => {
    const coordEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}, ${state},US&appid=${api_key}`;
    return fetch(GLOBALSTATE.proxy + coordEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
        }
    });
};

const requestCurrentLocation = (lat, lon) => {
    const locEndpoint = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${api_key}`;
    return fetch(GLOBALSTATE.proxy + locEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    });
};

const requestCurrentWeather = (lat, lon) => {
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${GLOBALSTATE.measure}&cnt=7`;
    return fetch(GLOBALSTATE.proxy + weatherEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    });
};

const requestCurrentForecast = (lat, lon) => {
    const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${api_key}&cnt=7&units=${GLOBALSTATE.measure}`; 
    return fetch(GLOBALSTATE.proxy + forecastEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    });
}; 

const requestFutureForecast = (lat, lon) => {
    const forecastEndpoint = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${api_key}&units=${GLOBALSTATE.measure}`;
    return fetch(GLOBALSTATE.proxy + forecastEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
            }
        });
};

export { 
    requestCurrentCoordinates,
    requestCurrentLocation,
    requestCurrentWeather, 
    requestCurrentForecast, 
    requestFutureForecast
}; 