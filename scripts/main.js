import { STATE, GLOBALSTATE, days } from "./state.js";
import { requestCurrentCoordinates, requestCurrentWeather } from "./request.js";
import { 
    setIcon, 
    setStats, 
    getLocation,
    getLocationStorage, 
    doesLocationExist, 
    countLocations, 
    deleteFromDatabase, 
    deleteFromLocalStorage
} from "./helper.js";

import { todayForecast, todayWeather, weekForecast } from "./mockdata.js";

const loadWeather = (locationElement) => {
    locationElement.addEventListener("click", () => {
        const [city, state] = locationElement
                        .firstChild
                        .querySelector(":nth-child(2)")
                        .firstChild
                        .textContent
                        .split(",");
        const currentForecast = document.querySelector(".weatherContainerCurrentForecast");
        const futureForecast = document.querySelector(".weatherContainerFutureForecast"); 

        const cityElement = document.createElement("h1"); 
        const timeElement = document.createElement("h3"); 
        const iconElement = document.createElement("i");
        const tempNumElement = document.createElement("div"); 

        getLocation(city.trim(), state.trim())
            .then(res => {
                    console.log(res);
                    cityElement.textContent = `${city}`; 
                    timeElement.textContent = (res.currentTime.toLocaleTimeString().length % 2 === 0) ? 
                    (`${days[res.currentTime.getDay()]} ${res.currentTime.toLocaleTimeString().substring(0, 4)} 
                    ${res.currentTime.toLocaleTimeString().substring(8, res.currentTime.toLocaleTimeString().length)}`) : 
                    (`${days[res.currentTime.getDay()]} ${res.currentTime.toLocaleTimeString().substring(0, 5)} 
                    ${res.currentTime.toLocaleTimeString().substring(9, res.currentTime.toLocaleTimeString().length)}`);
                    setIcon(iconElement, res.weatherCondition);

                    const currentTempElement = document.createElement("h1");
                    const currentHighLowElement = document.createElement("h6");

                    (GLOBALSTATE.measure === "imperial") ? 
                    currentTempElement.textContent = Math.round(res.currentTemperature) + "\u00b0" + "F": 
                    currentTempElement.textContent = Math.round(res.currentTemperature) + "\u00b0" + "C";
                    currentHighLowElement.textContent = `${Math.round(res.highLowTemperature.hi)}` + 
                    "\u00b0" + " / " + `${Math.round(res.highLowTemperature.low)}` + "\u00b0"; 
                    tempNumElement.className = "weatherCurrentTempNums"; 
                    tempNumElement.appendChild(currentTempElement);
                    tempNumElement.appendChild(currentHighLowElement); 

                    setStats("daily", 
                        res.currentTempStats.wind, 
                        res.currentTempStats.rain, 
                        res.currentTempStats.humidity, 
                        res.currentTempStats.clouds
                    ); 
                }
            );
        const currentWeatherLocationInfo = document.querySelector(".weatherCurrentInfoGeo");
        currentWeatherLocationInfo.innerHTML = '';
        currentWeatherLocationInfo.appendChild(cityElement);
        currentWeatherLocationInfo.appendChild(timeElement);

        const currentWeatherTempInfo = document.querySelector('.weatherCurrentTempInfo');
        currentWeatherTempInfo.innerHTML = '';
        currentWeatherTempInfo.appendChild(iconElement);
        currentWeatherTempInfo.appendChild(tempNumElement); 

        locationElement.style.backgroundColor = "#cecccc";
        if (GLOBALSTATE.currentLocationHover) GLOBALSTATE.currentLocationHover.style.backgroundColor = "#EEEEEE";
        GLOBALSTATE.currentLocationHover = locationElement; 
    })
}; 

const createAdditionalStatsContainer = (outerContainer) => {
    const windSpeedContainer = document.createElement("div");
    const rainVolumeContainer = document.createElement("div");
    const humidityContainer = document.createElement("div");
    const cloudinessContainer = document.createElement("div");

    windSpeedContainer.className = "weatherCurrentClimateContainers";
    rainVolumeContainer.className = "weatherCurrentClimateContainers";
    humidityContainer.className = "weatherCurrentClimateContainers";
    cloudinessContainer.className = "weatherCurrentClimateContainers";

    const windIcon = document.createElement("div"); 
    const rainIcon = document.createElement("div");
    const humidIcon = document.createElement("div");
    const cloudyIcon = document.createElement("div"); 

    windIcon.classList.add("wi", "wi-windy", "climate-icon");
    rainIcon.classList.add("wi", "wi-rain", "climate-icon");
    humidIcon.classList.add("wi", "wi-humidity", "climate-icon");
    cloudyIcon.classList.add("wi", "wi-cloudy", "climate-icon");

    const windNum = document.createElement("h6");
    const rainNum = document.createElement("h6");
    const humidNum = document.createElement("h6");
    const cloudyNum = document.createElement("h6");

    windNum.className = "windSpeed";
    rainNum.className = "rainVolume";
    humidNum.className = "humidity";
    cloudyNum.className = "cloudiness"; 

    windSpeedContainer.appendChild(windIcon); 
    windSpeedContainer.appendChild(windNum)
    rainVolumeContainer.appendChild(rainIcon);
    rainVolumeContainer.appendChild(rainNum);
    humidityContainer.appendChild(humidIcon); 
    humidityContainer.appendChild(humidNum);
    cloudinessContainer.appendChild(cloudyIcon);
    cloudinessContainer.appendChild(cloudyNum); 

    outerContainer.appendChild(windSpeedContainer);
    outerContainer.appendChild(rainVolumeContainer);
    outerContainer.appendChild(humidityContainer); 
    outerContainer.appendChild(cloudinessContainer); 
};

const createWeatherContainer = () => {
    const weatherContainer = document.querySelector(".weatherContainer");

    if (!weatherContainer.childNodes.length) {
        const currentWeatherInfoSection = document.createElement("div");
        const currentWeatherForecast = document.createElement("div"); 
        const futureWeatherForecast = document.createElement("div"); 
    
        currentWeatherInfoSection.className = "weatherContainerInfoSection";
        currentWeatherForecast.className = "weatherContainerCurrentForecast";
        futureWeatherForecast.className = "weatherContainerFutureForecast";
    
        const currentHeaderInfo = document.createElement("div"); 
        const currentLocationInfo = document.createElement("div"); 
        
        currentHeaderInfo.className = "weatherCurrentInfoHeader";
        currentLocationInfo.className = "weatherCurrentInfoGeo";
        currentHeaderInfo.appendChild(currentLocationInfo);
        currentWeatherInfoSection.appendChild(currentHeaderInfo);

        const currentTempInfo = document.createElement("div"); 
        currentTempInfo.className = "weatherCurrentTempInfo";
        currentWeatherInfoSection.appendChild(currentTempInfo);

        const currentAdditionalInfo = document.createElement("div"); 
        currentAdditionalInfo.className = "weatherCurrentAdditionalInfo"; 
        createAdditionalStatsContainer(currentAdditionalInfo); 
        currentWeatherInfoSection.appendChild(currentAdditionalInfo);
    
        weatherContainer.appendChild(currentWeatherInfoSection); 
        weatherContainer.appendChild(currentWeatherForecast);
        weatherContainer.appendChild(futureWeatherForecast);
    }
    console.log(weatherContainer);

}; 

const createMainContainers = (locationContainer, weatherContainer) => {
    const searchWeatherForm = document.createElement("form"); 
    const searchWeatherInput = document.createElement("input"); 

    locationContainer.className = 'locationContainer'; 
    weatherContainer.className = 'weatherContainer';
    searchWeatherForm.className = 'main-searchWeatherForm'; 
    searchWeatherInput.className = 'main-searchWeatherInput';
    searchWeatherInput.placeholder = 'City, State...';  
    searchWeatherForm.appendChild(searchWeatherInput); 
    locationContainer.appendChild(searchWeatherForm);

    return new Promise((resolve) => resolve(1)); 
}; 

const createLocationContainerElement = (res, locationContainer, city, state) => {
    const rawTime = res.currentTime.toLocaleTimeString(); 
    const rawTimeLength = rawTime.length; 
    const parsedTime = (rawTime.length % 2 === 0) ? 
    (`${rawTime[0]}:${rawTime.substring(2, 4)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`) : 
    (`${rawTime.substring(0, 2)}:${rawTime.substring(3, 5)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`); 
    const temperature = Math.round(res.currentTemperature); 
    const iconElement = document.createElement("i"); 
    setIcon(iconElement, res.weatherCondition);
    iconElement.className = `${iconElement.className}`;  
    const locationElementContainer = document.createElement("div"); 
    const rightLocationElementSection = document.createElement("div"); 
    const leftLocationElementSection = document.createElement("div"); 
    const rightLocationElementSectionText = document.createElement("div");  
    const locationTextElement = document.createElement("h2"); 
    const timeTextElement = document.createElement("h4");         
    const temperatureTextElement = document.createElement("h1");
    const deleteIcon = document.createElement("i");              
    locationTextElement.textContent = `${city}, ${state}`; 
    timeTextElement.textContent = `${parsedTime}`; 
    temperatureTextElement.textContent = (GLOBALSTATE.measure === "imperial") ? 
    temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "F" : 
    temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "C";
    deleteIcon.className = 'fa-solid fa-xmark'; 
    locationElementContainer.className = 'locationElement'; 
    rightLocationElementSection.className = 'rightLocationElementSection'; 
    leftLocationElementSection.className = 'leftLocationElementSection';  
    rightLocationElementSectionText.className = 'rightLocationsElementSectionText';  

    rightLocationElementSectionText.appendChild(locationTextElement); 
    rightLocationElementSectionText.appendChild(timeTextElement); 
    rightLocationElementSection.appendChild(iconElement); 
    rightLocationElementSection.appendChild(rightLocationElementSectionText);                     
    leftLocationElementSection.appendChild(temperatureTextElement); 
    leftLocationElementSection.appendChild(deleteIcon); 
    locationElementContainer.appendChild(rightLocationElementSection); 
    locationElementContainer.appendChild(leftLocationElementSection); 
    locationContainer.appendChild(locationElementContainer); 

    addDeleteLocationEvent(deleteIcon); 
    loadWeather(locationElementContainer); 
}; 

const addLocationElements = (location, container, locationContainer, weatherContainer) => {
    const locationElement = new DOMParser().parseFromString(location, "text/xml").firstChild;
    const city = locationElement.textContent.split(",")[0].trim(); 
    const state = locationElement.textContent.split(",")[1].trim(); 
    
    return getLocation(city, state)
        .then(res => {
            createLocationContainerElement(res, locationContainer, city, state); 
            container.appendChild(locationContainer); 
            container.appendChild(weatherContainer);
            createWeatherContainer();   
            return new Promise(resolve => resolve(1)); 
        })
        .catch(err => console.log(err)); 
}; 

const loadPage = async() => {
    const container = document.querySelector(".container"); 
    if (!GLOBALSTATE.locations) {
        const initContainer = document.createElement("div"); 
        const btn = document.createElement("button"); 

        initContainer.className = "initialLocationContainer"; 
        btn.className = "main-addLocation";
        btn.innerHTML = "<i class='fa-solid fa-plus addIcon'></i>Add Location"; 
        initContainer.appendChild(btn); 
        container.appendChild(initContainer);    
        GLOBALSTATE.status = STATE.initialLoad; 
        
        return new Promise(resolve => resolve(1)); 
    } else if (GLOBALSTATE.locations === 1) {    
        const locationContainer = document.createElement("div"); 
        const weatherContainer = document.createElement("div"); 
        const locationDOMElements = getLocationStorage(); 
        
        await createMainContainers(locationContainer, weatherContainer);
        // must return Promise so it can wait upon this operation to complete synchronously
        return new Promise(async resolve => {
            await addLocationElements(locationDOMElements[0], container, locationContainer, weatherContainer); 
            resolve(1); 
        });
    } else if (GLOBALSTATE.status != STATE.DELETE) {
        const locationDOMElements = getLocationStorage(); 
        const isLocationContainer = document.querySelector(".locationContainer"); 
        if (isLocationContainer) {
            const locationContainer = isLocationContainer; 
            return new Promise(resolve => {
                const lastIdx = locationDOMElements.length-1; 
                const locationElement = new DOMParser().parseFromString(locationDOMElements[lastIdx], "text/xml").firstChild;
                const city = locationElement.textContent.split(",")[0].trim(); 
                const state = locationElement.textContent.split(",")[1].trim(); 
                getLocation(city, state) 
                .then(res => {
                    createLocationContainerElement(res, locationContainer, city, state);
                    resolve(1); 
                })
                .catch(err => console.log(err)); 
            }); 
        // if reloaded then you have to retrieve the locationContainer from the localStorage as it is not saved 
        // when first loading into the page if there is stuff stored within localStorage 
        } else {
            const locationContainer = document.createElement("div"); 
            const weatherContainer = document.createElement("div"); 
            createMainContainers(locationContainer, weatherContainer);
            return new Promise(resolve => {
                locationDOMElements.forEach(async loc => {
                    await addLocationElements(loc, container, locationContainer, weatherContainer); 
                    resolve(1); 
                }); 
            }); 
        } 
    }
};

const getCurrentWeather = (lat, lon) => {
    requestCurrentWeather(lat, lon)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err)); 
}; 

/*
    =======Schema=======
    whenFetched: date 
    city: string 
    state: string
    latitude: int
    longtitude: int  
    currentWeather: openweatherAPI json 
    dailyForecast: openweatherAPI json 
    weeklyForecast: openweatherAPI json 
*/
const addToDatabase = (city, state) => {
    // fetch location
    return new Promise(resolve => {
        // requestCurrentCoordinates(city, state)
        // .then(res => res.json(); console.log(res.json()); )
        // .then(data => { return { lat: data[0].lat, lon: data[0].lon } }) 
        // // fetch currentWeatherData to initialize the document within the collection of the firestore database 
        // .then(coords => getCurrentWeather(coords.lat, coords.lat))
        // .then(currentWeatherData => {
        //     const lat = currentWeatherData.coord.lat; 
        //     const lon = currentWeatherData.coord.lon;
        //     return GLOBALSTATE.db.add({
        //         city: city, 
        //         state: state, 
        //         latitude: lat, 
        //         longtitude: lon, 
        //         currentWeather: currentWeatherData, 
        //     })
        // })
        // .then(res => { 
        //     console.log("WRITTEN TO", res.id)
        //     resolve(1); 
        // })
        // .catch(err => console.log(err)); 
        GLOBALSTATE.db.add({
            city: city,
            state: state,
            latitude: todayWeather.coord.lat, 
            longtitude: todayWeather.coord.lon, 
            currentWeather: todayWeather,
            currentForecast: todayForecast, 
            futureForecast: weekForecast 
        })
        resolve(1);

    })
}; 

// store it within the localStorage and because storage updates, then reload the DOM 
const saveLocations = async(city, state) => {    
    if (!GLOBALSTATE.locations) {
        const initContainer   = document.querySelector(".initialLocationContainer"); 
        const locationElement = document.createElement("div"); 
        // styling 
        locationElement.className   = "locationElement"; 
        locationElement.textContent = `${city}, ${state}`; 
        // delete the old UI and add the new UI for the locations being existent 
        initContainer.remove(); 
        // save it within local storage 
        const allLocations = getLocationStorage(); 
        allLocations.push(locationElement.outerHTML); 
        GLOBALSTATE.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
        GLOBALSTATE.locations += 1; 
        GLOBALSTATE.status = STATE.ADD; 
        await loadPage();
        setTimeout(() => {
            location.reload(); 
        }, 150)
    } else { 
        const locationElement = document.createElement("div"); 
        locationElement.className = "locationElement"; 
        locationElement.textContent = `${city}, ${state}`;

        const allLocations = getLocationStorage(); 
        allLocations.push(locationElement.outerHTML); 
        GLOBALSTATE.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
        GLOBALSTATE.locations += 1; 
        GLOBALSTATE.status = STATE.ADD; 
        loadPage(); 
    }
}; 

// now handle the input 
const inputLocation = (formClassname, inputClassname) => {
    const formElement = document.querySelector(formClassname); 
    formElement.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        const locationElement = document.querySelector(inputClassname); 
        const parsedLocationElement = locationElement.value.trim();
          
        // parsing matters now with the user input with location 
        // if not City, State format 
        let city = ""; let state = ""; 
        if (parsedLocationElement.indexOf(",") === -1) {
            parsedLocationElement.split(" ").forEach((word, idx) => {
                if (idx !== parsedLocationElement.split(" ").length-1) city += `${word} `;
            }); 
            city = city.trim(); 
            state = parsedLocationElement.split(" ")[parsedLocationElement.split(" ").length-1]; 
        } else {
            const parsedLocation = parsedLocationElement.split(","); 
            city = parsedLocation[0]; 
            state = parsedLocation[1].trim(); 
            // once parsed use the data to add it to the data 
            // if empty then add otherwise do nothing since it is already within the database
            doesLocationExist(city, state)
                .then(async(res) => {
                    if (res) {
                        await addToDatabase(city, state);
                        saveLocations(city, state); 
                    } else console.log("already exists"); 
                })
        } 
        locationElement.value = ""; 
    })
};

const addLocation = () => {
    // if there are no current locations for weather then initialize 
    if (!GLOBALSTATE.locations) {
        const btnElement = document.querySelector(".main-addLocation");  
        // click on the add btn to input the first location 
        btnElement.addEventListener("click", async() => {
            const parentElement = document.querySelector(".initialLocationContainer");  
            const formElement = document.createElement("form"); 
            const inputElement = document.createElement("input");
            formElement.className = "main-inputWrapper"; 
            inputElement.className = "main-inputLocation"; 
            inputElement.placeholder = "City, State..."; 
            btnElement.remove();
            formElement.appendChild(inputElement); 
            parentElement.appendChild(formElement); 
            // now handle the input 
            inputLocation("." + formElement.className, "." + inputElement.className);
        }); 
    // if there is at least one location within the db then check if it is already 
    // within the database then do nothing otherwise add it 
    } else {
        inputLocation("." + "main-searchWeatherForm", "." + "main-searchWeatherInput")
    }; 
}; 

const addDeleteLocationEvent = (delIconElement) => {
    delIconElement.addEventListener("click", () => {
        const [city, state] = delIconElement
                            .parentElement
                            .parentElement
                            .firstChild
                            .querySelector(":nth-child(2)")
                            .querySelector(":nth-child(1)")
                            .textContent
                            .split(",");
        deleteFromDatabase(city.trim(), state.trim()); 
        deleteFromLocalStorage(city.trim(), state.trim()); 
        GLOBALSTATE.locations -= 1; 
        GLOBALSTATE.status = STATE.DELETE; 

        if (!GLOBALSTATE.locations) {
            const locationContainer = document.querySelector(".locationContainer");
            const weatherContainer = document.querySelector(".weatherContainer"); 

            locationContainer.remove();
            weatherContainer.remove(); 
            loadPage(); 
            addLocation();
        }

    })
};  

window.addEventListener("DOMContentLoaded", () => {
    countLocations()
        .then(async(res) => {
            GLOBALSTATE.locations = res;
            if (!GLOBALSTATE.locations) {
                loadPage();
                addLocation();
            } else {
                await loadPage(); 
                addLocation();
            }
        }) 
    }
); 