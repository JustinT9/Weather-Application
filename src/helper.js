import { firebaseApp } from "./config.js"; 
import { GLOBALSTATE } from "./state.js";

// sets up the icon representing the weather 
const setIcon = (iconElement, weather) => { 
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
        case "rain and snow": 
            iconElement.className = "wi wi-rain-mix"; 
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

// sets up additional climate statistics for the current day 
const setStats = (type, windSpeed, data, humidity, cloudiness) => {  
    const windElement = document.querySelector(".windSpeed"); 
    const rainElement = document.querySelector('.rainVolume'); 
    const humidityElement = document.querySelector(".humidity");
    const precipitation = (data.rain ? data.rain : (data.snow ? data.snow : null)); 
    const cloudyElement = document.querySelector(".cloudiness"); 

    windElement.textContent = `${Math.round(windSpeed)} mph`; 
    humidityElement.textContent = `${humidity}%`; 
    rainElement.textContent = ((type === "daily" && precipitation) ? `${precipitation["1h"]}mm` : 
                            ((type === "week" && precipitation) ? `${data.rain} mm` : `0 mm`));
    cloudyElement.textContent = `${cloudiness}%`; 
}; 

// helper function to retrieve data about a location to display 
const getLocation = (city, state) => {
    const query = GLOBALSTATE.db 
        .where("city", "==", city)
        .where("state", "==", state); 

    return query
        .get() 
        .then(res => {
            const currentTime = new Date(); 
            const weatherCondition = res.docs[0].data().currentWeather.weather[0].description;
            const currentTemperature = res.docs[0].data().currentWeather.main.temp;  
            const highTemperature = res.docs[0].data().currentWeather.main.temp_max; 
            const lowTemperature = res.docs[0].data().currentWeather.main.temp_min;
            const currentTempStats = {
                "wind": res.docs[0].data().currentWeather.wind.speed, 
                "rain": res.docs[0].data().currentWeather, 
                "humidity": res.docs[0].data().currentWeather.main.humidity, 
                "clouds": res.docs[0].data().currentWeather.clouds.all 
            }; 
            const currentForecastStats = res.docs[0].data().currentForecast;
            const futureForecastStats = res.docs[0].data().futureForecast; 

            return { 
                currentTime: currentTime, 
                weatherCondition: weatherCondition,
                currentTemperature: currentTemperature, 
                highLowTemperature: { "hi": highTemperature, "low": lowTemperature }, 
                currentTempStats: currentTempStats, 
                currentForecastStats: currentForecastStats, 
                futureForecastStats: futureForecastStats
            }; 
        })
        .catch(err => console.log(err)); 
}; 

const getLocationStorage = () => {
    let allLocations; 
    if (GLOBALSTATE.locationStorage.getItem("locations") === null) allLocations = []; 
    else allLocations = JSON.parse(GLOBALSTATE.locationStorage.getItem("locations"));
    return allLocations; 
}

// verify if the location exists within the database or not by querying the fields 
const doesLocationExist = (city, state) => {
    const query = GLOBALSTATE.db
        .where("city", "==", city)
        .where("state", "==", state);
    // return the booleans and return that promise which will be called through another with this function 
    return query
        .get()
        .then(doc => doc.empty)
        .catch(err => console.log(err));        
}; 

// to make sure if there are locations the accurate number of locations are 
// accounted for within the db for when they first load into the UI 
const countLocations = () => {
    return firebaseApp
        .firestore()
        .collection("locations")
        .get()
        .then(res => res.docs.length); 
}; 

const deleteFromDatabase = (city, state) => {
    const query = GLOBALSTATE.db
                    .where("city", "==", city)
                    .where("state", "==", state); 

    query
        .get()
        .then(data => {
            data.forEach(res => {
                res.ref.delete(); 
                console.log(`Location ${city}, ${state} successfully deleted.`);  
            })
        })
        .catch(err => console.log(err)); 
}; 

const deleteFromLocalStorage = (city, state) => {
    const locationsStorage = getLocationStorage(); 
    const newLocationsStorage = 
        locationsStorage.filter(location => {
            const locationDOMElement = new DOMParser().parseFromString(location, "text/xml");
            const locationTextContent = locationDOMElement.firstChild.textContent; 
            const cityText = locationTextContent.split(",")[0].trim();
            const stateText = locationTextContent.split(",")[1].trim();
            return city !== cityText || state !== stateText; 
        });
    GLOBALSTATE.locationStorage.setItem("locations", JSON.stringify(newLocationsStorage));
    const locationContainer = document.querySelector(".locationContainer"); 
    if (locationContainer) {
        locationContainer.childNodes
        .forEach(locElement => {
            if (locElement.textContent.includes(city) && locElement.textContent.includes(state)) {
                locationContainer.removeChild(locElement); 
            }
        })
    }
};

export { 
    setIcon, 
    setStats, 
    getLocation,
    getLocationStorage, 
    doesLocationExist, 
    countLocations, 
    deleteFromDatabase, 
    deleteFromLocalStorage
}