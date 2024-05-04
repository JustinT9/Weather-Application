import { State } from "../util/state.js";
import { WeatherRequest } from "../util/WeatherRequest.js";
import { 
    Utilities, 
    LocationQuery, 
    LocationStorage,
} from "../util/Utilities.js";
import { LocationMap } from "../map/WeatherMap.js";

class WeatherMenuDisplay {
    static createMainContainers = (
        locationContainer, 
        weatherContainer
    ) => {
        const searchWeatherForm = document.createElement("form"); 
        const searchWeatherInput = document.createElement("input"); 
    
        locationContainer.className = "locationContainer"; 
        weatherContainer.className = "weatherContainer";
        searchWeatherForm.className = "main-searchWeatherForm"; 
        searchWeatherInput.className = "main-searchWeatherInput";
        searchWeatherInput.placeholder = "City, State...";  

        searchWeatherForm.appendChild(searchWeatherInput); 
        locationContainer.appendChild(searchWeatherForm);

        return new Promise(resolve => resolve(1)); 
    }; 

    static createWeatherContainer = () => {
        const weatherContainer = document.querySelector(".weatherContainer");
    
        if (!weatherContainer.childNodes.length) {
            const currentWeatherInfoSection = document.createElement("div");
            currentWeatherInfoSection.className = "weatherContainerInfoSection";

            const currentWeatherForecast = document.createElement("div"); 
            currentWeatherForecast.className = "weatherContainerCurrentForecast";

            const futureWeatherForecast = document.createElement("div"); 
            futureWeatherForecast.className = "weatherContainerFutureForecast";
        
            const currentHeaderInfo = document.createElement("div"); 
            currentHeaderInfo.className = "weatherCurrentInfoHeader";

            const currentLocationInfo = document.createElement("div"); 
            currentLocationInfo.className = "weatherCurrentInfoGeo";

            const currentMetricSelector = document.createElement("div"); 
            currentMetricSelector.className = "weatherCurrentMetrics"; 
            
            currentHeaderInfo.appendChild(currentLocationInfo);
            currentHeaderInfo.appendChild(currentMetricSelector); 
            currentWeatherInfoSection.appendChild(currentHeaderInfo);
    
            const currentTempInfo = document.createElement("div"); 
            currentTempInfo.className = "weatherCurrentTempInfo";
            currentWeatherInfoSection.appendChild(currentTempInfo);
    
            const currentAdditionalInfo = document.createElement("div"); 
            currentAdditionalInfo.className = "weatherCurrentAdditionalInfo"; 
            currentWeatherInfoSection.appendChild(currentAdditionalInfo);
        
            weatherContainer.appendChild(currentWeatherInfoSection); 
            weatherContainer.appendChild(currentWeatherForecast);
            weatherContainer.appendChild(futureWeatherForecast);
        }
        console.log(weatherContainer);
    }; 

    static createAdditionalStatsContainer = () => {
        const outerContainer = document.querySelector(".weatherCurrentAdditionalInfo");
        outerContainer.innerHTML = ""; 
    
        const windSpeedContainer = document.createElement("div");
        windSpeedContainer.className = "weatherCurrentClimateContainers";

        const rainVolumeContainer = document.createElement("div");
        rainVolumeContainer.className = "weatherCurrentClimateContainers";

        const humidityContainer = document.createElement("div");
        humidityContainer.className = "weatherCurrentClimateContainers";

        const cloudinessContainer = document.createElement("div");
        cloudinessContainer.className = "weatherCurrentClimateContainers";
    
        const windIcon = document.createElement("div"); 
        windIcon.classList.add("wi", "wi-windy", "climate-icon");

        const rainIcon = document.createElement("div");
        rainIcon.classList.add("wi", "wi-rain", "climate-icon");

        const humidIcon = document.createElement("div");
        humidIcon.classList.add("wi", "wi-humidity", "climate-icon");

        const cloudyIcon = document.createElement("div"); 
        cloudyIcon.classList.add("wi", "wi-cloudy", "climate-icon");
        
        const windNum = document.createElement("h6");
        windNum.className = "windSpeed";

        const rainNum = document.createElement("h6");
        rainNum.className = "rainVolume";

        const humidNum = document.createElement("h6");
        humidNum.className = "humidity";

        const cloudyNum = document.createElement("h6");
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

    static createLocationContainer = (
        res, 
        locationContainer, 
        city, 
        state, 
        locationClass, 
        locationElementClass, 
        rightLocationElementSectionClass, 
        leftLocationElementSectionClass, 
        rightLocationElementSectionTextClass, 
    ) => {
        const rawTime = res.currentTime.toLocaleTimeString(); 
        const rawTimeLength = rawTime.length; 
        const parsedTime = (rawTimeLength % 2 === 0) ? 
        (`${rawTime[0]}:${rawTime.substring(2, 4)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`) : 
        (`${rawTime.substring(0, 2)}:${rawTime.substring(3, 5)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`); 
    
        const iconElement = document.createElement("i"); 
        Utilities.setIcon(iconElement, res.weatherCondition);
        iconElement.className = `${iconElement.className}`;  
      
        const locationTextElement = document.createElement("h2"); 
        locationTextElement.textContent = `${city}, ${state}`; 
        
        const timeTextElement = document.createElement("h4");       
        timeTextElement.textContent = `${parsedTime}`; 

        const temperature = Math.round(res.currentTemperature);
        const temperatureTextElement = document.createElement("h1");
        temperatureTextElement.textContent = (State.metric === "imperial") ? 
        temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "F" : 
        temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "C";
    
        const deleteIcon = document.createElement("i");        
        deleteIcon.className = "fa-solid fa-xmark"; 
        
        const locationElementContainer = document.createElement("div"); 
        locationElementContainer.className = locationElementClass; 

        const rightLocationElementSection = document.createElement("div"); 
        rightLocationElementSection.className = rightLocationElementSectionClass; 
        
        const leftLocationElementSection = document.createElement("div"); 
        leftLocationElementSection.className = leftLocationElementSectionClass;
        
        const rightLocationElementSectionText = document.createElement("div");
        rightLocationElementSectionText.className = rightLocationElementSectionTextClass;  
        rightLocationElementSectionText.appendChild(locationTextElement); 
        rightLocationElementSectionText.appendChild(timeTextElement); 

        rightLocationElementSection.appendChild(iconElement); 
        rightLocationElementSection.appendChild(rightLocationElementSectionText);                     
        leftLocationElementSection.appendChild(temperatureTextElement); 
        leftLocationElementSection.appendChild(deleteIcon); 
        locationElementContainer.appendChild(rightLocationElementSection); 
        locationElementContainer.appendChild(leftLocationElementSection); 
        locationContainer.appendChild(locationElementContainer); 
    
        LocationHandler.addDeleteLocationEvent(deleteIcon, locationClass); 
        State.relPath === "WeatherMenu.html" && WeatherMenuDisplay.displayWeather(locationElementContainer); 
    }; 

    static addLocationElement = (
        location, 
        container, 
        locationContainer, 
        weatherContainer
    ) => {
        const locationElement = new DOMParser().parseFromString(location, "text/xml").firstChild;
        const city = locationElement.textContent.split(",")[0].trim(); 
        const state = locationElement.textContent.split(",")[1].trim(); 

        return LocationQuery
            .getLocation(city, state)
            .then(res => {
                const locationClass = ".locationContainer"; 
                const locationElementClass = "locationElement";
                const rightLocationElementSectionClass = "rightLocationElementSection"; 
                const leftLocationElementSectionClass = "leftLocationElementSection";  
                const rightLocationElementSectionTextClass = "rightLocationElementSectionText"; 

                WeatherMenuDisplay.createLocationContainer(
                    res, 
                    locationContainer, 
                    city, 
                    state, 
                    locationClass, 
                    locationElementClass, 
                    rightLocationElementSectionClass, 
                    leftLocationElementSectionClass, 
                    rightLocationElementSectionTextClass 
                ); 
                container.appendChild(locationContainer); 
                container.appendChild(weatherContainer);
                WeatherMenuDisplay.createWeatherContainer();   
                return new Promise(resolve => resolve(1)); 
            })
            .catch(err => console.log(err)); 
    }; 

    static displayPage = async() => {
        const container = document.querySelector(".container"); 
        if (!State.locations) {
            const initContainer = document.createElement("div"); 
            initContainer.className = "initialLocationContainer"; 

            const btn = document.createElement("button"); 
            btn.className = "main-addLocation";
            btn.innerHTML = "<i class='fa-solid fa-plus addIcon'></i>Add Location"; 

            initContainer.appendChild(btn); 
            container.appendChild(initContainer);    
            State.applicationStatus = State.pageStatus.INIT; 
            
            return new Promise(resolve => resolve(1)); 
        } else if (State.locations === 1) {    
            const locationContainer = document.createElement("div"); 
            const weatherContainer = document.createElement("div"); 
            const locationDOMElements = LocationStorage.getLocationStorage(); 
            
            await WeatherMenuDisplay.createMainContainers(locationContainer, weatherContainer);
            // must return Promise so it can wait upon this operation to complete synchronously
            return new Promise(async resolve => {
                await WeatherMenuDisplay.addLocationElement(locationDOMElements[0], container, locationContainer, weatherContainer); 
                resolve(1); 
            });
        } else if (State.applicationStatus !== State.pageStatus.DELETE) {
            const locationDOMElements = LocationStorage.getLocationStorage(); 
            const isLocationContainer = document.querySelector(".locationContainer"); 
            if (isLocationContainer) {
                const locationContainer = isLocationContainer; 
                return new Promise(resolve => {
                    const lastIdx = locationDOMElements.length-1; 
                    const locationElement = new DOMParser().parseFromString(locationDOMElements[lastIdx], "text/xml").firstChild;
                    const city = locationElement.textContent.split(",")[0].trim(); 
                    const state = locationElement.textContent.split(",")[1].trim(); 
                    LocationQuery.getLocation(city, state)
                    .then(res => {
                        const locationClass = ".locationContainer"; 
                        const locationElementClass = "locationElement";
                        const rightLocationElementSectionClass = "rightLocationElementSection"; 
                        const leftLocationElementSectionClass = "leftLocationElementSection";  
                        const rightLocationElementSectionTextClass = "rightLocationElementSectionText"; 
                        
                        WeatherMenuDisplay.createLocationContainer(
                            res, 
                            locationContainer, 
                            city, 
                            state, 
                            locationClass, locationElementClass, 
                            rightLocationElementSectionClass, 
                            leftLocationElementSectionClass, 
                            rightLocationElementSectionTextClass
                        );
                        resolve(1); 
                    })
                    .catch(err => console.log(err)); 
                }); 
            // if reloaded then you have to retrieve the locationContainer from the localStorage as it is not saved 
            // when first loading into the page if there is stuff stored within localStorage 
            } else {
                const locationContainer = document.createElement("div"); 
                const weatherContainer = document.createElement("div"); 
                WeatherMenuDisplay.createMainContainers(locationContainer, weatherContainer);
                return new Promise(resolve => {
                    locationDOMElements.forEach(async loc => {
                        await WeatherMenuDisplay.addLocationElement(loc, container, locationContainer, weatherContainer); 
                        resolve(1); 
                    }); 
                }); 
            } 
        }
    };

    static displayCurrentForecast = (
        currentForecast, 
        currentForecastContainer
    ) => {
        const forecast = currentForecast.slice(0, 4); 
        currentForecastContainer.innerHTML = ""; 
        Utilities.setDaily(currentForecastContainer, forecast); 
    }; 

    static displayFutureForecast = (
        futureForecast, 
        futureForecastContainer
    ) => {    
        const forecast = futureForecast.slice(0, 3); 
        futureForecastContainer.innerHTML = ""; 
        Utilities.setWeekly(futureForecastContainer, forecast); 
    }; 

    static displayWeatherUtil = (
        res, 
        city, 
        iconElement, 
        cityElement, 
        timeElement, 
        tempNumElement
    ) => {
        Utilities.setInfo(cityElement, timeElement, city);
        Utilities.setIcon(iconElement, res.weatherCondition);

        const fahrenheitIcon = document.createElement("i"); 
        fahrenheitIcon.classList.add("wi", "wi-fahrenheit", "metric-icon"); 

        const celsiusIcon = document.createElement("i"); 
        celsiusIcon.classList.add("wi", "wi-celsius", "metric-icon");                     

        const delimiterText = document.createElement("h5"); 
        delimiterText.textContent = " | "; 

        const currentWeatherMetrics = document.querySelector(".weatherCurrentMetrics");
        currentWeatherMetrics.innerHTML = "";
        currentWeatherMetrics.appendChild(fahrenheitIcon); 
        currentWeatherMetrics.appendChild(delimiterText);
        currentWeatherMetrics.appendChild(celsiusIcon); 

        const currentTempElement = document.createElement("h1");
        const currentHighLowElement = document.createElement("h6");
        Utilities.setTemp(
            currentTempElement, 
            currentHighLowElement, 
            State.metric, 
            res.currentTemperature, 
            res.highLowTemperature.hi, 
            res.highLowTemperature.low
        );
        tempNumElement.className = "weatherCurrentTempNums"; 
        tempNumElement.appendChild(currentTempElement);
        tempNumElement.appendChild(currentHighLowElement); 
    }; 

    static displayWeather = (
        locationElement
    ) => {
        locationElement.addEventListener("click", () => {
            const [city, state] = locationElement
                            .firstChild
                            .querySelector(":nth-child(2)")
                            .firstChild
                            .textContent
                            .split(",");
            const currentForecast = document.querySelector(".weatherContainerCurrentForecast");
            const futureForecast = document.querySelector(".weatherContainerFutureForecast"); 
            const iconElement = document.createElement("i");
            const cityElement = document.createElement("h1"); 
            const timeElement = document.createElement("h3"); 
            const tempNumElement = document.createElement("div"); 
    
            LocationQuery.getLocation(city.trim(), state.trim())
                .then(res => {
                    WeatherMenuDisplay.displayWeatherUtil(
                        res,
                        city, 
                        iconElement, 
                        cityElement, 
                        timeElement, 
                        tempNumElement
                    );
                    WeatherMenuDisplay.createAdditionalStatsContainer(); 

                    const windElement = document.querySelector(".windSpeed"); 
                    const rainElement = document.querySelector('.rainVolume'); 
                    const humidityElement = document.querySelector(".humidity");
                    const cloudyElement = document.querySelector(".cloudiness"); 
                    Utilities.setStats(
                        windElement, 
                        rainElement, 
                        humidityElement, 
                        cloudyElement, 
                        "daily", 
                        res.currentTempStats.wind, 
                        res.currentTempStats.rain, 
                        res.currentTempStats.humidity, 
                        res.currentTempStats.clouds
                    ); 
                    WeatherMenuDisplay.displayCurrentForecast(res.currentForecastStats.list, currentForecast);
                    WeatherMenuDisplay.displayFutureForecast(res.futureForecastStats.list, futureForecast); 
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
            if (State.currentLocationView) State.currentLocationView.style.backgroundColor = "#EEEEEE";
            State.currentLocationView = locationElement; 
        })
    }; 
}; 

class LocationHandler {
    static addToDb = (
        city, 
        state
    ) => {
        return new Promise(resolve => {
            WeatherRequest.requestCurrentCoordinates(city, state)
            .then(res => res.json())
            .then(data => { return { lat: data[0].lat, lon: data[0].lon } }) 
            // fetch data to initialize the document within the collection of the firestore database 
            .then(async coords => {
                const currentWeather = await WeatherRequest.requestCurrentWeather(coords.lat, coords.lon).then(res => res.json());
                const currentForecast = await WeatherRequest.requestCurrentForecast(coords.lat, coords.lon).then(res => res.json());
                const futureForecast = await WeatherRequest.requestFutureForecast(coords.lat, coords.lon).then(res => res.json()); 

                State.db.add({
                    city: city,
                    state: state,
                    latitude: currentWeather.coord.lat, 
                    longtitude: currentWeather.coord.lon, 
                    currentWeather: currentWeather,
                    currentForecast: currentForecast, 
                    futureForecast: futureForecast 
                })
                resolve(1); 
            })
            .catch(err => console.log(err)); 
        })
    }; 

    // store it within the localStorage and because storage updates, then reload the DOM 
    static saveLocations = async(
        city, 
        state
    ) => {    
        if (!State.locations) {            
            const locationElement = document.createElement("div"); 
            locationElement.className = "locationElement"; 
            locationElement.textContent = `${city}, ${state}`; 
            // delete the old UI and add the new UI for the locations being existent 
            State.relPath === "WeatherMenu.html" && 
            document.querySelector(".initialLocationContainer").remove(); 
            // save it within local storage 
            const allLocations = LocationStorage.getLocationStorage(); 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
            State.applicationStatus = State.pageStatus.ADD; 
            State.locations += 1; 
            (State.relPath === "WeatherMenu.html" && 
            await WeatherMenuDisplay.displayPage() && 
            setTimeout(() => {
                location.reload(); 
            }, 150)) || 
            (State.relPath === "WeatherMap.html" && 
            LocationMap.displayLocations()); 
        } else { 
            const locationElement = document.createElement("div"); 
            locationElement.className = "locationElement"; 
            locationElement.textContent = `${city}, ${state}`;

            const allLocations = LocationStorage.getLocationStorage(); 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
            State.applicationStatus = State.pageStatus.ADD; 
            State.locations += 1; 
            (State.relPath === "WeatherMenu.html" && 
            WeatherMenuDisplay.displayPage()) || 
            (State.relPath === "WeatherMap.html" && 
            LocationMap.displayLocations()); 
        }
    }; 

    // now handle the input 
    static inputLocation = (
        formClassname, 
        inputClassname
    ) => {
        const formElement = document.querySelector(formClassname); 
        formElement.addEventListener("submit", (e) => { 
            e.preventDefault(); 
            const locationInput = document.querySelector(inputClassname);
            // parsing matters now with the user input with location 
            // if not City, State format 
            const parsedLocationInput = document.querySelector(inputClassname).value.trim();
            Utilities.parseInput(parsedLocationInput); 
          
            // once parsed use the data to add it to the data 
            // if empty then add otherwise do nothing since it is already within the database
            const city = State.cityStatePair["city"]; 
            const state = State.cityStatePair["state"];
            LocationQuery.doesLocationExist(city, state)
                .then(async(res) => {
                    if (res) {
                        await LocationHandler.addToDb(city, state);
                        LocationHandler.saveLocations(city, state); 
                    } else console.log("already exists"); 
                })
            locationInput.value = ""; 
        })
    };

    static addLocation = () => {
        // if there are no current locations for weather then initialize 
        if (!State.locations) {
            const btnElement = document.querySelector(".main-addLocation");
    
            btnElement.addEventListener("click", async() => {
                const formElement = document.createElement("form"); 
                formElement.className = "main-inputWrapper"; 

                const inputElement = document.createElement("input");
                inputElement.className = "main-inputLocation"; 
                inputElement.placeholder = "City, State..."; 
    
                btnElement.remove();
                formElement.appendChild(inputElement); 

                const parentElement = document.querySelector(".initialLocationContainer");  
                parentElement.appendChild(formElement); 
                // now handle the input 
                LocationHandler.inputLocation("." + formElement.className, "." + inputElement.className);
            }); 
        // if there is at least one location within the db then check if it is already 
        // within the database then do nothing otherwise add it 
        } else {
            LocationHandler.inputLocation("." + "main-searchWeatherForm", "." + "main-searchWeatherInput")
        }; 
    }; 
    
    static addDeleteLocationEvent = (
        delIconElement, 
        locationClass 
    ) => {
        delIconElement.addEventListener("click", () => {
            const [city, state] = delIconElement
                                .parentElement
                                .parentElement
                                .firstChild
                                .querySelector(":nth-child(2)")
                                .querySelector(":nth-child(1)")
                                .textContent
                                .split(",");
            LocationQuery.deleteFromDatabase(city.trim(), state.trim()); 
            LocationStorage.deleteFromLocalStorage(city.trim(), state.trim(), locationClass); 
            State.applicationStatus = State.pageStatus.DELETE; 
            State.locations -= 1; 
    
            if (State.relPath === "WeatherMenu.html" && !State.locations) {
                const locationContainer = document.querySelector(".locationContainer");
                locationContainer.remove();

                const weatherContainer = document.querySelector(".weatherContainer"); 
                weatherContainer.remove(); 

                WeatherMenuDisplay.displayPage(); 
                LocationHandler.addLocation();
            }
        })
    };  
}; 

State.relPath === "WeatherMenu.html" && 
window.addEventListener("DOMContentLoaded", () => {
    LocationQuery.countLocations()
        .then(async(res) => {
            State.locations = res;
            if (!State.locations) {
                WeatherMenuDisplay.displayPage();
                LocationHandler.addLocation();
            } else {
                await WeatherMenuDisplay.displayPage(); 
                LocationHandler.addLocation();
            }
            console.log(State.locations); 
        }) 
    }
); 

export { 
    WeatherMenuDisplay, 
    LocationHandler 
}; 