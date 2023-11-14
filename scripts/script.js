import api_key from "../config.js"; 

const getWeather = () => {
    const key = api_key; 
    const city = "Scotch Plains"; 
    const state = "NJ"; 
    const proxy = "https://cors-anywhere.herokuapp.com/";   
    const location = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${key}`;
     
    const response = fetch(proxy + location, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json(); 
    })
    .then(data => console.log(data))
    .catch(error => console.log(error)) 
}

// getWeather(); 