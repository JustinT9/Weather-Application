import { api_key } from "./config.js";
import { State } from "./State.js";

class WeatherRequest {
    static requestCurrentCoordinates = (city, state) => {
        const coordEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}, ${state},US&appid=${api_key}`;
        return fetch(State.proxyURL + coordEndpoint, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
            }
        });
    };
    
    static requestCurrentLocation = (lat, lon) => {
        const locEndpoint = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${api_key}`;
        return fetch(State.proxyURL + locEndpoint, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json", 
            }
        });
    };
    
    static requestCurrentWeather = (lat, lon) => {
        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${State.metric}&cnt=7`;
        return fetch(State.proxyURL + weatherEndpoint, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json"
            }
        });
    };
    
    static requestCurrentForecast = (lat, lon) => {
        const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${api_key}&cnt=7&units=${State.metric}`; 
        return fetch(State.proxyURL + forecastEndpoint, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json", 
            }
        });
    }; 
    
    static requestFutureForecast = (lat, lon) => {
        const forecastEndpoint = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${api_key}&units=${State.metric}`;
        return fetch(State.proxyURL + forecastEndpoint, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
            }
        });
    }; 
}; 

export { WeatherRequest }; 