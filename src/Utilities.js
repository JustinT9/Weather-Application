import { firebaseApp } from "./config.js"; 
import { State } from "./State.js";
import { WeatherPage } from "./WeatherPage.js"
import { todayWeather, todayForecast, weekForecast } from "./TestData.js";

class Utilities { 
    // sets up the icon representing today's weather 
    static setIcon = (iconElement, weather) => { 
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

    // sets up the time and location of today's weather 
    static setInfo = (city) => {
        const locElement = document.querySelector('.currentGeo h1'); 
        const dateElement = document.querySelector('.currentGeo h3'); 
        const date = new Date(Date.now()); 
        city.split(" ").forEach((word, idx) => {
            if (idx === 0) locElement.textContent = ""; 
            locElement.textContent += `${word[0].toUpperCase()}` + `${word.substring(1).toLowerCase()} `; 
        })
        dateElement.textContent = (date.toLocaleTimeString().length % 2 === 0) ? 
        (`${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 4)} 
        ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
        (`${State.dayNames[date.getDay()]} ${date.toLocaleTimeString().substring(0, 5)} 
        ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`);
    }; 

    // sets up the main statistics of today's weather 
    static setTemp = (metric, temp, maxTemp, minTemp) => {
        const tempElement = document.querySelector('.tempNum h1'); 
        const minMaxElement = document.querySelector('.tempNum h6'); 

        (metric === "imperial") ? 
        tempElement.textContent = Math.round(temp) + "\u00b0" + "F": 
        tempElement.textContent = Math.round(temp) + "\u00b0" + "C";
        (metric === "imperial") ? 
        minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + 
        `${Math.round(minTemp)}`+ "\u00b0" : 
        minMaxElement.textContent = `${Math.round(maxTemp)}` + "\u00b0" + ` / ` + 
        `${Math.round(minTemp)}` + "\u00b0";  
    };
    
    // sets up the climate highlights of today's weather
    static setHighlights = (feelsLike, visibility, sunriseTime, sunsetTime) => {
        const feelsElement = document.querySelector(".feelslike h4"); 
        const visibleElement = document.querySelector(".visible h4");  
        const sunriseElement = document.querySelector(".sunrise h4"); 
        const sunsetElement = document.querySelector(".sunset h4"); 
        const sunrise = new Date(sunriseTime * 1000).toLocaleTimeString(); 
        const sunset = new Date(sunsetTime * 1000).toLocaleTimeString(); 

        feelsElement.textContent = `${Math.round(feelsLike)}` + "\u00b0"; 
        (visibility === "???") ? 
        (visibleElement.textContent = "???") : 
        (visibleElement.textContent = `${((visibility / 1000) / 1.609).toFixed(1)} mi`); 
        sunriseElement.textContent = (sunrise.length % 2 === 0) ? 
        (`${sunrise.substring(0, 4)} ${sunrise.substring(8, sunrise.length)}`) : 
        (`${sunrise.substring(0, 5)} ${sunrise.substring(9, sunrise.length)}`);
        sunsetElement.textContent = (sunset.length % 2 === 0) ? 
        (`${sunset.substring(0, 4)} ${sunset.substring(8, sunset.length)}`) : 
        (`${sunset.substring(0, 5)} ${sunset.substring(9, sunset.length)}`); 
    }; 
    
    // sets up additional climate statistics for the current day 
    static setStats = (type, windSpeed, data, humidity, cloudiness) => {  
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

    // sets up the weather forecast for each hour of today's weather 
    static setDaily = (dailyInfo) => {
        const forecastElement = document.querySelector('.dailyForecast'); 
        
        dailyInfo.forEach((info, idx) => {
            const iconElement = document.createElement('i'); 
            const timeElement = document.createElement('h4'); 
            const tempElement = document.createElement('h4'); 
            const hourlyForecastElement = document.createElement('div'); 
            const time = new Date(info.dt * 1000); 
            const desc = info.weather[0].description; 

            Utilities.setIcon(iconElement, desc); 
            hourlyForecastElement.className = "hourlyForecast"; 
            idx === 0 ? timeElement.textContent = "Now" :  
            timeElement.textContent = (time.toLocaleTimeString().length % 2 === 0) ? 
            (`${time.toLocaleTimeString().substring(0, 4)} 
            ${time.toLocaleTimeString().substring(8, time.toLocaleTimeString().length)}`) : 
            (`${time.toLocaleTimeString().substring(0, 5)} 
            ${time.toLocaleTimeString().substring(9, time.toLocaleTimeString().length)}`); 

            tempElement.textContent = Math.round(info.main.temp) + "\u00b0"; 
            hourlyForecastElement.appendChild(timeElement); 
            hourlyForecastElement.appendChild(iconElement); 
            hourlyForecastElement.appendChild(tempElement);
            forecastElement.appendChild(hourlyForecastElement); 
        }); 
    }; 

    // sets up the weather forecast for each day in the upcoming week 
    static setWeekly = (weekInfo) => {
        const forecastElement = document.querySelector(".forecastWeather"); 

        weekInfo.forEach((daily, idx) => {
            const iconElement = document.createElement("i"); 
            const dayElement = document.createElement("h4"); 
            const tempElement = document.createElement("h4");
            const container = document.createElement("div");
            const desc = daily.weather[0].description; 

            container.className = "forecastDay"; 
            tempElement.className = "forecastTemp"; 
            Utilities.setIcon(iconElement, desc); 
            (idx === 0) ? dayElement.textContent = "Today" :  
            (dayElement.textContent = `${State.dayNames[new Date(daily.dt * 1000).getDay()]}`);
            tempElement.textContent = `${Math.round(daily.temp.max) + "\u00b0"} / ${Math.round(daily.temp.min) + "\u00b0"}`;
            
            container.appendChild(dayElement);
            container.appendChild(iconElement);
            container.appendChild(tempElement);
            forecastElement.appendChild(container); 
        }); 
    }; 

    // must clear the DOM before if there a DOM already existed does to ensure page is not loaded incorrectly
    static clear = () => {
        const dailyForecast  = document.querySelector(".dailyForecast"); 
        const weeklyForecast = document.querySelector(".forecastWeather"); 
        while (dailyForecast.firstChild || weeklyForecast.firstChild) {
            if (dailyForecast.firstChild) dailyForecast.firstChild.remove(); 
            if (weeklyForecast.firstChild) weeklyForecast.firstChild.remove(); 
        }
    }; 

    static mockData = () => {
        const desc = todayWeather.weather[0].description; 
        const iconElement = document.querySelector(".currentTempInfo i"); 
        
        State.currentWeather = todayWeather; 
        Utilities.setIcon(iconElement, desc); iconElement.className = `${iconElement.className} weather-icon`;
        Utilities.setInfo(todayWeather.name); 
        Utilities.setTemp(State.metric, todayWeather.main.temp, todayWeather.main.temp_max, todayWeather.main.temp_min); 
        Utilities.setStats(State.flag, todayWeather.wind.speed, todayWeather, todayWeather.main.humidity, todayWeather.clouds.all); 
        Utilities.setHighlights(todayWeather.main.feels_like, todayWeather.visibility, todayWeather.sys.sunrise, todayWeather.sys.sunset);
        Utilities.setDaily(todayForecast); 
        Utilities.setWeekly(weekForecast);
        WeatherPage.displayHourlyForecast(State.metric); 
        WeatherPage.displayWeeklyForecast(weekForecast); 
        WeatherPage.switchMetrics(); 
    }; 
};  

class LocationQuery {
    // helper function to retrieve data about a location from firebase to display 
    static getLocation = (city, state) => {
        const query = State.db 
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

    // verify if the location exists within the database or not by querying the fields 
    static doesLocationExist = (city, state) => {
        const query = State.db
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
    static countLocations = () => {
        return firebaseApp
            .firestore()
            .collection("locations")
            .get()
            .then(res => res.docs.length); 
    }; 

    static deleteFromDatabase = (city, state) => {
        const query = State.db
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
};

class LocationStorage { 
    static getLocationStorage = () => {
        let allLocations; 
        if (State.locationStorage.getItem("locations") === null) allLocations = []; 
        else allLocations = JSON.parse(State.locationStorage.getItem("locations"));
        return allLocations; 
    }

    static deleteFromLocalStorage = (city, state) => {
        const locationsStorage = LocationStorage.getLocationStorage(); 
        const newLocationsStorage = 
            locationsStorage.filter(location => {
                const locationDOMElement = new DOMParser().parseFromString(location, "text/xml");
                const locationTextContent = locationDOMElement.firstChild.textContent; 
                const cityText = locationTextContent.split(",")[0].trim();
                const stateText = locationTextContent.split(",")[1].trim();
                return city !== cityText || state !== stateText; 
            });
        State.locationStorage.setItem("locations", JSON.stringify(newLocationsStorage));
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
};

export { 
    Utilities, 
    LocationQuery,
    LocationStorage, 
}