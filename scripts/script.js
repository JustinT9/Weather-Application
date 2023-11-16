import { api_key, city, state } from "../config.js"; 

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

const setStats = (windSpeed, precipitation, humidity) => {  

}; 

const getWeather = () => {
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

        // fahrenheit
        const metric = 'imperial'
        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${metric}`;

        const weather = fetch(proxy + weatherEndpoint, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            return res.json(); 

        }).then(data => { 
            setInfo(newCity, newState); 
            setTemp(data.main.temp, data.main.temp_max, data.main.temp_min); 
            console.log(data); 

        }).catch(error => console.log(error)) 

    }).catch(error => console.log(error)) 
}

// getWeather(); 
