import { api_key } from "../../config.js";
import { State } from "./state.js";

class WeatherRequest {
    static fetchBody = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
        }
    }; 

    static requestCurrentCoordinates = (
        city, 
        state
    ) => {
        const coordEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}, ${state},US&appid=${api_key}`;
        return fetch(State.proxyURL + coordEndpoint, this.fetchBody);
    };
    
    static requestCurrentLocation = (
        lat, 
        lon
    ) => {
        const locEndpoint = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${api_key}`;
        return fetch(State.proxyURL + locEndpoint, this.fetchBody);
    };
    
    static requestPresentWeather = (
        lat, 
        lon
    ) => {
        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${State.metric}&cnt=7`;
        return fetch(State.proxyURL + weatherEndpoint, this.fetchBody);
    };
    
    static requestPresentForecast = (
        lat, 
        lon
    ) => {
        const forecastEndpoint = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${api_key}&cnt=7&units=${State.metric}`; 
        return fetch(State.proxyURL + forecastEndpoint, this.fetchBody);
    }; 
    
    static requestFutureForecast = (
        lat, 
        lon
    ) => {
        const forecastEndpoint = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${api_key}&units=${State.metric}`;
        return fetch(State.proxyURL + forecastEndpoint, this.fetchBody);
    }; 
}; 

export { WeatherRequest }; 