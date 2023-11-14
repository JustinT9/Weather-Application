import { api_key, city, state} from "../config.js"; 

const updateInfo = (city, state, date) => {
    const locationElement = document.querySelector('h1'); 
    const dateElement = document.querySelector('h3'); 
    const dateObj = new Date(date); 

    locationElement.textContent = `${city}, ${state}`; 
    dateElement.textContent = `${dateObj.getDay().toLocaleString()}, ${dateObj.getMonth().toLocaleString()} ${dateObj.getDate()}`; 
}; 

const updateTemp = (temp, maxTemp, minTemp) => {
    const tempElement = document.querySelector('.temp h1'); 
    const minMaxElement = document.querySelector('.temp h6'); 

    tempElement.textContent = Math.round(temp); 
    minMaxElement.textContent = `${Math.round(maxTemp)}` + ` / ` + `${Math.round(minTemp)}`; 
}; 

const getWeather = () => {
    const key = api_key; 
    const proxy = "https://cors-anywhere.herokuapp.com/";   
    const locationEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${key}`;
     
    const location = fetch(proxy + locationEndpoint, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json(); 

    }).then(data => {
        console.log(data); 
        const lat = data[0].lat; 
        const lon = data[0].lon; 
        const newCity = data[0].name; 
        const newState = data[0].state; 

        // fahrenheit
        const metric = 'imperial'
        console.log(lat, lon); 

        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${metric}`;

        const weather = fetch(proxy + weatherEndpoint, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json(); 

        }).then(data => { 
            console.log(data); 
            updateInfo(newCity, newState, data.dt); 
            updateTemp(data.main.temp, data.main.temp_max, data.main.temp_min); 

        }).catch(error => console.log(error)) 

    }).catch(error => console.log(error)) 
}

getWeather(); 

