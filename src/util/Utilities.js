import { firebaseApp } from "../../config.js"; 
import { State } from "./state.js";

class Utilities { 
    // sets up the icon representing today's weather 
    static setIcon = (
        iconElement, 
        weatherDesc
    ) => { 
        switch (weatherDesc) {
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

    static setDate = (
        dateElement
    ) => {
        const date = new Date(Date.now());
        const dayName = State.language === State.languages.EN ? 
            State.dayNames[date.getDay()] :
            State.englishToSpanishTranslation.dayNames[date.getDay()];  
        dateElement.textContent = (State.timeConvention === State.timeConventions.TWELVE) ? 
        ((date.toLocaleTimeString().length % 2 === 0) ? 
        (`${dayName} ${date.toLocaleTimeString().substring(0, 4)} 
        ${date.toLocaleTimeString().substring(8, date.toLocaleTimeString().length)}`) : 
        (`${dayName} ${date.toLocaleTimeString().substring(0, 5)} 
        ${date.toLocaleTimeString().substring(9, date.toLocaleTimeString().length)}`)) :
        `${dayName} ${Utilities.convertToTwentyFourHourTime(date)}`;
    }; 

    // sets up the time and location of today's weather 
    static setInfo = (
        locationElement, 
        dateElement, 
        cityText
    ) => {
        cityText.split(" ").forEach(
                (word, idx) => {
                if (idx === 0) locationElement.textContent = ""; 
                locationElement.textContent += `${word[0].toUpperCase()}` + `${word.substring(1).toLowerCase()} `; 
            }
        ); 
        this.setDate(dateElement); 
    }; 

    // sets up the main statistics of today's weather 
    static setTemp = (
        tempElement, 
        minMaxElement, 
        metric, 
        tempDigit, 
        maxTemp, 
        minTemp
    ) => {
        (metric === "imperial") ? 
        tempElement.textContent = Math.round(tempDigit) + "\u00b0" + "F": 
        tempElement.textContent = Math.round(Utilities.convertToCelsius(tempDigit)) + "\u00b0" + "C";
        minMaxElement.textContent = `${Math.round(metric === "imperial" ? maxTemp : Utilities.convertToCelsius(maxTemp))}` 
        + "\u00b0" + ` / ` + `${Math.round(metric === "imperial" ? minTemp : Utilities.convertToCelsius(minTemp))}`+ "\u00b0";
    };

    // sets up additional climate statistics for the current day 
    static setStats = (
        windElement, 
        rainElement, 
        humidityElement, 
        cloudyElement, 
        precipitationType, 
        windSpeed, 
        weatherData, 
        humidity, 
        cloudiness
    ) => {  
        const precipitation = (weatherData.rain ? weatherData.rain : (weatherData.snow ? weatherData.snow : null)); 
        windElement.textContent = `${Math.round(windSpeed)} mph`; 
        humidityElement.textContent = `${humidity}%`; 
        rainElement.textContent = ((precipitationType === "daily" && precipitation) ? `${precipitation["1h"]}mm` : 
                                ((precipitationType === "week" && precipitation) ? `${weatherData.rain} mm` : `0 mm`));
        cloudyElement.textContent = `${cloudiness}%`; 
    }; 

    static setHighlightLabels = (
        highlightsLabel, 
        feelsLikeLabelElement,
        visibilityLabelElement, 
        sunriseLabelElement, 
        sunsetLabelElement
    ) => {
        const [
            feelsLikeLabel, 
            visibilityLabel,
            sunriseLabel,
            sunsetLabel 
        ] = [document.querySelector(`.${feelsLikeLabelElement.className} i`),
            document.querySelector(`.${visibilityLabelElement.className} i`),
            document.querySelector(`.${sunriseLabelElement.className} i`),
            document.querySelector(`.${sunsetLabelElement.className} i`)];
        
        highlightsLabel.textContent = State.language === State.languages.EN ? 
            "Today's Highlights" : State.englishToSpanishTranslation.TodayHighlights;

        feelsLikeLabel.textContent = State.language === State.languages.EN ? 
            " Feels Like" : ` ${State.englishToSpanishTranslation.FeelsLike}`; 
        feelsLikeLabel.style.fontSize = State.language === State.languages.ES ? "1.15rem" : "1.5rem";

        visibilityLabel.textContent = State.language === State.languages.EN ? 
            " Visibility" : ` ${State.englishToSpanishTranslation.Visibility}`; 
        visibilityLabel.style.fontsize = State.language === State.languages.ES ? "1.15rem" : "2rem"; 

        sunriseLabel.textContent = State.language === State.languages.EN ? 
            " Sunrise" : ` ${State.englishToSpanishTranslation.Sunrise}`; 
        sunsetLabel.textContent = State.language === State.languages.EN ? 
            " Sunset" : ` ${State.englishToSpanishTranslation.Sunset}`; 
    };

    static setHighlightTimes = (
        sunriseElement, 
        sunsetElement,
        sunriseTime, 
        sunsetTime
    ) => {
        const sunrise = State.timeConvention === State.timeConventions.TWELVE ? 
        new Date(sunriseTime * 1000).toLocaleTimeString() : 
        Utilities.convertToTwentyFourHourTime(new Date(sunriseTime * 1000)); 
        sunriseElement.textContent = (sunrise.length % 2 === 0) ? 
        (`${sunrise.substring(0, 4)} ${sunrise.substring(8, sunrise.length)}`) : 
        (`${sunrise.substring(0, 5)} ${sunrise.substring(9, sunrise.length)}`);

        const sunset = State.timeConvention === State.timeConventions.TWELVE ? 
        new Date(sunsetTime * 1000).toLocaleTimeString() : 
        Utilities.convertToTwentyFourHourTime(new Date(sunsetTime * 1000)); 
        sunsetElement.textContent = (sunset.length % 2 === 0) ? 
        (`${sunset.substring(0, 4)} ${sunset.substring(8, sunset.length)}`) : 
        (`${sunset.substring(0, 5)} ${sunset.substring(9, sunset.length)}`); 
    }; 
    
    // sets up the climate highlights of today's weather
    static setHighlights = (
        feelsLikeElement, 
        visibilityElement, 
        sunriseElement, 
        sunsetElement, 
        feelsLike, 
        visibility, 
        sunriseTime, 
        sunsetTime
    ) => {
        feelsLikeElement.textContent = `${Math.round(
            State.metric === "imperial" ? feelsLike : Utilities.convertToCelsius(feelsLike)
        )}` + "\u00b0"; 
        (visibility === "???") ? 
        (visibilityElement.textContent = "???") : 
        (visibilityElement.textContent = `${((visibility / 1000) / 1.609).toFixed(1)} mi`); 
        
        const highlightsLabel = document.querySelector(".weatherPageHighlightsContainer h4"); 
        this.setHighlightLabels(
            highlightsLabel, 
            feelsLikeElement.parentElement, 
            visibilityElement.parentElement,
            sunriseElement.parentElement,
            sunsetElement.parentElement); 
        this.setHighlightTimes(sunriseElement, sunsetElement, sunriseTime, sunsetTime); 
    }; 

    // sets up the weather forecast for each hour of today's weather 
    static setPresentForecast = (
        presentForecastElement, 
        presentForecastData
    ) => {        
        presentForecastData.forEach((info, idx) => {
            const hourlyForecastElement = document.createElement("div"); 
            hourlyForecastElement.className = "hourlyForecast"; 
            
            const iconElement = document.createElement("i"); 
            const weatherDesc = info.weather[0].description; 
            Utilities.setIcon(iconElement, weatherDesc); 

            const timeElement = document.createElement("h4"); 
            const time = new Date(info.dt * 1000); 
            timeElement.textContent = idx === 0 ? 
                (State.language === State.languages.EN ? "Now" : State.englishToSpanishTranslation.Now) : 
                (State.timeConvention === State.timeConventions.TWELVE) ? 
                    ((time.toLocaleTimeString().length % 2 === 0) ? 
                        (`${time.toLocaleTimeString().substring(0, 4)} 
                        ${time.toLocaleTimeString().substring(8, time.toLocaleTimeString().length)}`) : 
                        (`${time.toLocaleTimeString().substring(0, 5)} 
                        ${time.toLocaleTimeString().substring(9, time.toLocaleTimeString().length)}`)) : 
                    Utilities.convertToTwentyFourHourTime(time);  
            
            const tempElement = document.createElement("h4"); 
            tempElement.textContent = Math.round(
                State.metric === "imperial" ? info.main.temp : Utilities.convertToCelsius(info.main.temp)
            ) + "\u00b0"; 
            
            hourlyForecastElement.appendChild(timeElement); 
            hourlyForecastElement.appendChild(iconElement); 
            hourlyForecastElement.appendChild(tempElement);
            presentForecastElement.appendChild(hourlyForecastElement); 
        }); 
    }; 

    // Sets up the weather forecast for each day in the upcoming week 
    static setFutureForecast = (
        forecastElement, 
        futureForecastData
    ) => {
        futureForecastData.forEach(
            (daily, idx) => {
                const container = document.createElement("div");
                container.className = "forecastDay"; 

                const dayElement = document.createElement("h4"); 
                dayElement.textContent = idx === 0 ?  
                    State.language === State.languages.EN ? "Today" : State.englishToSpanishTranslation.Today : 
                    State.language === State.languages.EN ? 
                        `${State.dayNames[new Date(daily.dt * 1000).getDay()]}` : 
                        `${State.englishToSpanishTranslation.dayNames[new Date(daily.dt * 1000).getDay()]}`;
                container.appendChild(dayElement);

                const iconElement = document.createElement("i"); 
                const weatherDesc = daily.weather[0].description; 
                Utilities.setIcon(iconElement, weatherDesc); 
                container.appendChild(iconElement);

                const tempElement = document.createElement("h4");
                tempElement.className = "forecastTemp"; 
                tempElement.textContent = `${Math.round(
                    State.metric === "imperial" ? daily.temp.max : Utilities.convertToCelsius(daily.temp.max)
                ) + "\u00b0"} / ${Math.round(
                    State.metric === "imperial" ? daily.temp.min : Utilities.convertToCelsius(daily.temp.min)
                ) + "\u00b0"}`;
                container.appendChild(tempElement);
                forecastElement.appendChild(container); 
            }
        ); 
    }; 

    // must clear the DOM before if there a DOM already existed does to ensure page is not loaded incorrectly
    static clearWeather = () => {
        const dailyForecast = document.querySelector(".dailyForecast"); 
        const weeklyForecast = document.querySelector(".forecastWeather"); 
        while (dailyForecast.firstChild || weeklyForecast.firstChild) {
            if (dailyForecast.firstChild) dailyForecast.firstChild.remove(); 
            if (weeklyForecast.firstChild) weeklyForecast.firstChild.remove(); 
        }
    }; 

    // Parses the city, state input for computational value 
    static parseInput = (inputValue) => {
        if (inputValue.indexOf(",") !== -1) {
            const [city, state] = [inputValue.split(",")[0].toLowerCase(), inputValue.split(",")[1].trim()]; 
            State.cityStatePair = {"city": city, "state": state}; 
        } else {
            inputValue.split(" ").forEach(
                (word, idx) => {
                    if (idx !== inputValue.split(" ").length-1) city += `${word} `;
                }
            ); 
            const [city, state] = [city.trim(), inputValue.split(" ")[inputValue.split(" ").length-1]]; 
            State.cityStatePair = {"city": city, "state": state}; 
        }   
    }; 

    static convertToCelsius = temp => (5/9) * (temp - 32); 

    static convertToTwentyFourHourTime = time => time.toTimeString().split(" ")[0].substring(0, 5); 
    
};  

class LocationQuery {
    // helper function to retrieve data about a location from firebase to display 
    static getLocation = (
        city, 
        state
    ) => {
        const query = State.db 
            .where("city", "==", city)
            .where("state", "==", state); 
    
        return query
        .get() 
        .then(res => {
            const presentTime = new Date();
            const presentWeather = res.docs[0].data().presentWeather;  
            const weatherCondition = res.docs[0].data().presentWeather.weather[0].description;
            const presentTemperature = res.docs[0].data().presentWeather.main.temp;  
            const highTemperature = res.docs[0].data().presentWeather.main.temp_max; 
            const lowTemperature = res.docs[0].data().presentWeather.main.temp_min;
            const presentTempStats = {
                "wind": res.docs[0].data().presentWeather.wind.speed, 
                "rain": res.docs[0].data().presentWeather, 
                "humidity": res.docs[0].data().presentWeather.main.humidity, 
                "clouds": res.docs[0].data().presentWeather.clouds.all 
            }; 
            const presentForecastStats = res.docs[0].data().presentForecast;
            const futureForecastStats = res.docs[0].data().futureForecast; 

            return { 
                presentTime: presentTime,
                presentWeather: presentWeather, 
                location: { "city": city, "state": state },  
                weatherCondition: weatherCondition,
                presentTemperature: presentTemperature, 
                highLowTemperature: { "hi": highTemperature, "low": lowTemperature }, 
                presentTempStats: presentTempStats, 
                presentForecastStats: presentForecastStats, 
                futureForecastStats: futureForecastStats
            }; 
        })
        .catch(err => console.log(err)); 
    }; 

    // verify if the location exists within the database or not by querying the fields 
    static doesLocationExist = (
        city, 
        state
    ) => {
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

    static deleteFromDatabase = (
        city, 
        state
    ) => {
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
    static getStorageItem = (item) => {
        let allItems; 
        if (State.locationStorage.getItem(item) === null) allItems = [] 
        else allItems = JSON.parse(State.locationStorage.getItem(item));
        return allItems; 
    }

    static deleteFromLocalStorage = (
        city, 
        state, 
        locationClassname
    ) => {
        const locationsStorage = LocationStorage.getStorageItem("locations"); 
        const newLocationsStorage = 
            locationsStorage.filter(location => {
                const locationDOMElement = new DOMParser().parseFromString(location, "text/xml");
                const locationTextContent = locationDOMElement.firstChild.textContent; 
                const cityText = locationTextContent.split(",")[0].trim();
                const stateText = locationTextContent.split(",")[1].trim();
                return city.toLowerCase() !== cityText.toLowerCase() || state.toLowerCase() !== stateText.toLowerCase(); 
            });
        State.locationStorage.setItem("locations", JSON.stringify(newLocationsStorage));
        const locationContainer = document.querySelector(locationClassname); 
        if (locationContainer) {
            locationContainer
                .childNodes
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