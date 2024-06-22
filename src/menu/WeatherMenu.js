import { State } from "../util/state.js";
import { WeatherRequest } from "../util/WeatherRequest.js";
import { 
    Utilities, 
    LocationQuery, 
    LocationStorage,
} from "../util/Utilities.js";
import { LocationMap } from "../map/WeatherMap.js";
import { WeatherSettings } from "../settings/WeatherSettings.js";
import { WeatherPage } from "../page/WeatherPage.js";

class WeatherMenuDisplay {
    static createMainContainers = (
        mainContainer,
        locationContainer, 
        weatherInfoContainer
    ) => {
        const searchWeatherForm = document.createElement("form"); 
        const searchWeatherInput = document.createElement("input"); 
    
        mainContainer.className = "weatherMenuMainContainer";
        locationContainer.className = "weatherMenuLocationContainer"; 
        weatherInfoContainer.className = "weatherInfoContainer";
        searchWeatherForm.className = "main-searchWeatherForm"; 
        searchWeatherInput.className = "main-searchWeatherInput";
        searchWeatherInput.placeholder = "City, State...";  

        searchWeatherForm.appendChild(searchWeatherInput); 
        mainContainer.appendChild(searchWeatherForm);
        return new Promise(resolve => resolve(1)); 
    }; 

    static createWeatherInfoContainer = () => {
        const weatherInfoContainer = document.querySelector(".weatherInfoContainer");
    
        if (!weatherInfoContainer.childNodes.length) {
            const currentWeatherInfoSection = document.createElement("div");
            currentWeatherInfoSection.className = "weatherInfoContainerMainSection";

            const currentWeatherForecast = document.createElement("div"); 
            currentWeatherForecast.className = "weatherInfoContainerPresentForecast";

            const futureWeatherForecast = document.createElement("div"); 
            futureWeatherForecast.className = "weatherInfoContainerFutureForecast";
        
            const currentHeaderInfo = document.createElement("div"); 
            currentHeaderInfo.className = "weatherInfoContainerHeader";

            const currentLocationInfo = document.createElement("div"); 
            currentLocationInfo.className = "weatherInfoContainerLocation";
            
            currentHeaderInfo.appendChild(currentLocationInfo);
            currentWeatherInfoSection.appendChild(currentHeaderInfo);
    
            const currentTempInfo = document.createElement("div"); 
            currentTempInfo.className = "weatherInfoContainerTemp";        
            currentWeatherInfoSection.appendChild(currentTempInfo);
    
            const currentAdditionalInfo = document.createElement("div"); 
            currentAdditionalInfo.className = "weatherInfoContainerStats"; 
            currentWeatherInfoSection.appendChild(currentAdditionalInfo);
        
            weatherInfoContainer.appendChild(currentWeatherInfoSection); 
            weatherInfoContainer.appendChild(currentWeatherForecast);
            weatherInfoContainer.appendChild(futureWeatherForecast);
        }
    }; 

    static createAdditionalStatsContainer = () => {   
        const windSpeedContainer = document.createElement("div");
        windSpeedContainer.className = "weatherInfoContainerIndividualStat";
        const windIcon = document.createElement("div"); 
        windIcon.classList.add("wi", "wi-windy", "climate-icon");
        windSpeedContainer.appendChild(windIcon); 

        const rainVolumeContainer = document.createElement("div");
        rainVolumeContainer.className = "weatherInfoContainerIndividualStat";
        const rainIcon = document.createElement("div");
        rainIcon.classList.add("wi", "wi-rain", "climate-icon");
        rainVolumeContainer.appendChild(rainIcon);
        
        const humidityContainer = document.createElement("div");
        humidityContainer.className = "weatherInfoContainerIndividualStat";
        const humidIcon = document.createElement("div");
        humidIcon.classList.add("wi", "wi-humidity", "climate-icon");
        humidityContainer.appendChild(humidIcon); 

        const cloudinessContainer = document.createElement("div");
        cloudinessContainer.className = "weatherInfoContainerIndividualStat";
        const cloudyIcon = document.createElement("div"); 
        cloudyIcon.classList.add("wi", "wi-cloudy", "climate-icon");
        cloudinessContainer.appendChild(cloudyIcon);

        const outerContainer = document.querySelector(".weatherInfoContainerStats");
        outerContainer.innerHTML = "";

        const windNum = document.createElement("h6");
        windNum.className = "windSpeed";
        windSpeedContainer.appendChild(windNum)
        outerContainer.appendChild(windSpeedContainer);

        const rainNum = document.createElement("h6");
        rainNum.className = "rainVolume";
        rainVolumeContainer.appendChild(rainNum);
        outerContainer.appendChild(rainVolumeContainer);

        const humidNum = document.createElement("h6");
        humidNum.className = "humidity";
        humidityContainer.appendChild(humidNum);
        outerContainer.appendChild(humidityContainer); 

        const cloudyNum = document.createElement("h6");
        cloudyNum.className = "cloudiness"; 
        cloudinessContainer.appendChild(cloudyNum); 
        outerContainer.appendChild(cloudinessContainer); 
    };

    static createLocationContainer = (
        res, 
        mainContainer, 
        locationContainer, 
        city, 
        state, 
        locationClass, 
        locationElementClass, 
        weatherMenuLocationElementRightSectionClassname, 
        weatherMenuLeftLocationElementLeftSectionClassname, 
        weatherMenuLocationElementRightSectionTextClassname, 
    ) => {
        const rawTime = res.presentTime.toLocaleTimeString(); 
        const rawTimeLength = rawTime.length; 
        const parsedTime = (rawTimeLength % 2 === 0) ? 
        (`${rawTime[0]}:${rawTime.substring(2, 4)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`) : 
        (`${rawTime.substring(0, 2)}:${rawTime.substring(3, 5)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`); 
    
        const iconElement = document.createElement("i"); 
        Utilities.setIcon(iconElement, res.weatherCondition);
        iconElement.className = `${iconElement.className}`;  
      
        const locationTextElement = document.createElement("h2"); 
        locationTextElement.textContent = `${city}, ${state}`; 
        city.split(" ").forEach((word, idx) => {
            if (idx === 0) locationTextElement.textContent = "";
            locationTextElement.textContent += `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`; 
            if (idx < city.split(" ").length-1) locationTextElement.textContent += " ";
        })
        locationTextElement.textContent += `, ${state}`; 
        
        const timeTextElement = document.createElement("h4");       
        timeTextElement.textContent = `${parsedTime}`; 

        const temperature = Math.round(res.presentTemperature);
        const temperatureTextElement = document.createElement("h1");
        temperatureTextElement.textContent = (State.metric === "imperial") ? 
        temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "F" : 
        temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "C";
    
        const deleteIcon = document.createElement("i");        
        deleteIcon.className = "fa-solid fa-xmark"; 
        
        const locationElementContainer = document.createElement("div"); 
        locationElementContainer.className = locationElementClass; 

        const weatherMenuLocationElementRightSection = document.createElement("div"); 
        weatherMenuLocationElementRightSection.className = weatherMenuLocationElementRightSectionClassname; 
        
        const weatherMenuLocationElementLeftSection = document.createElement("div"); 
        weatherMenuLocationElementLeftSection.className = weatherMenuLeftLocationElementLeftSectionClassname;
        
        const weatherMenuLocationElementRightSectionText = document.createElement("div");
        weatherMenuLocationElementRightSectionText.className = weatherMenuLocationElementRightSectionTextClassname;  
        weatherMenuLocationElementRightSectionText.appendChild(locationTextElement); 
        weatherMenuLocationElementRightSectionText.appendChild(timeTextElement); 

        weatherMenuLocationElementRightSection.appendChild(iconElement); 
        weatherMenuLocationElementRightSection.appendChild(weatherMenuLocationElementRightSectionText);                     
        weatherMenuLocationElementLeftSection.appendChild(temperatureTextElement); 
        weatherMenuLocationElementLeftSection.appendChild(deleteIcon); 
        locationElementContainer.appendChild(weatherMenuLocationElementRightSection); 
        locationElementContainer.appendChild(weatherMenuLocationElementLeftSection); 
        locationContainer.appendChild(locationElementContainer); 
        State.relPath === "WeatherMenu.html" && mainContainer.appendChild(locationContainer); 

        LocationHandler.addDeleteLocationEvent(deleteIcon, locationClass);
        State.relPath === "WeatherMenu.html" && WeatherMenuDisplay.displayWeather(locationElementContainer); 
    }; 

    static addLocationElement = (
        location, 
        container, 
        mainContainer, 
        locationContainer, 
        weatherInfoContainer
    ) => {
        const locationElement = new DOMParser().parseFromString(location, "text/xml").firstChild;
        const city = locationElement.textContent.split(",")[0].trim(); 
        const state = locationElement.textContent.split(",")[1].trim(); 

        return LocationQuery
            .getLocation(city, state)
            .then(res => {
                const locationClass = ".weatherMenuLocationContainer"; 
                const locationElementClass = "weatherMenuLocationElement";
                const weatherMenuLocationElementRightSectionClassname = "weatherMenuLocationElementRightSection"; 
                const weatherMenuLeftLocationElementLeftSectionClassname = "weatherMenuLocationElementLeftSection";  
                const weatherMenuLocationElementRightSectionTextClassname = "weatherMenuLocationElementRightSectionText"; 

                WeatherMenuDisplay.createLocationContainer(
                    res, 
                    mainContainer, 
                    locationContainer, 
                    city, 
                    state, 
                    locationClass, 
                    locationElementClass, 
                    weatherMenuLocationElementRightSectionClassname, 
                    weatherMenuLeftLocationElementLeftSectionClassname, 
                    weatherMenuLocationElementRightSectionTextClassname 
                ); 
                container.appendChild(mainContainer); 
                container.appendChild(weatherInfoContainer);
                WeatherMenuDisplay.createWeatherInfoContainer();   
                return new Promise(resolve => resolve(1)); 
            })
            .catch(err => console.log(err)); 
    }; 

    static displayPage = async() => {
        const container = document.querySelector(".container"); 
        if (!State.locations) {
            const initContainer = document.createElement("div"); 
            initContainer.className = "weatherMenuInitContainer"; 

            const btn = document.createElement("button"); 
            btn.className = "main-addLocation";
            btn.innerHTML = "<i class='fa-solid fa-plus addIcon'></i>Add Location"; 

            initContainer.appendChild(btn); 
            container.appendChild(initContainer);    
            State.applicationStatus = State.pageStatus.INIT; 
            
            return new Promise(resolve => resolve(1)); 
        } else if (State.locations === 1) {    
            const mainContainer = document.createElement("div"); 
            const locationContainer = document.createElement("div"); 
            const weatherInfoContainer = document.createElement("div"); 
            const locationDOMElements = LocationStorage.getStorageItem("locations"); 
            
            await WeatherMenuDisplay.createMainContainers(
                mainContainer, 
                locationContainer, 
                weatherInfoContainer
            );
            // must return Promise so it can wait upon this operation to complete synchronously
            return new Promise(async resolve => {
                await WeatherMenuDisplay.addLocationElement(
                    locationDOMElements[0], 
                    container, 
                    mainContainer, 
                    locationContainer, 
                    weatherInfoContainer
                ); 
                WeatherMenuDisplay.displayToggledElement(); 
                resolve(1); 
            });
        } else if (State.applicationStatus !== State.pageStatus.DELETE) {
            const locationDOMElements = LocationStorage.getStorageItem("locations"); 
            const mainContainer = document.querySelector(".weatherMenuMainContainer");
            const isLocationContainer = document.querySelector(".weatherMenuLocationContainer"); 
            if (mainContainer && isLocationContainer) {
                const locationContainer = isLocationContainer; 
                return new Promise(resolve => {
                    const lastIdx = locationDOMElements.length-1; 
                    const locationElement = new DOMParser().parseFromString(locationDOMElements[lastIdx], "text/xml").firstChild;
                    const city = locationElement.textContent.split(",")[0].trim(); 
                    const state = locationElement.textContent.split(",")[1].trim(); 
                    LocationQuery.getLocation(city, state)
                    .then(res => {
                        const locationClass = ".weatherMenuLocationContainer"; 
                        const locationElementClass = "weatherMenuLocationElement";
                        const weatherMenuLocationElementRightSectionClassname = "weatherMenuLocationElementRightSection"; 
                        const weatherMenuLeftLocationElementLeftSectionClassname = "weatherMenuLocationElementLeftSection";  
                        const weatherMenuLocationElementRightSectionTextClassname = "weatherMenuLocationElementRightSectionText"; 
                        
                        WeatherMenuDisplay.createLocationContainer(
                            res, 
                            mainContainer,
                            locationContainer, 
                            city, 
                            state, 
                            locationClass, 
                            locationElementClass, 
                            weatherMenuLocationElementRightSectionClassname, 
                            weatherMenuLeftLocationElementLeftSectionClassname, 
                            weatherMenuLocationElementRightSectionTextClassname
                        );
                        WeatherMenuDisplay.displayToggledElement(); 
                        resolve(1); 
                    })
                    .catch(err => console.log(err)); 
                }); 
            // if reloaded then you have to retrieve the locationContainer from the localStorage as it is not saved 
            // when first loading into the page if there is stuff stored within localStorage 
            } else {
                const mainContainer = document.createElement("div"); 
                const locationContainer = document.createElement("div"); 
                const weatherInfoContainer = document.createElement("div"); 
                WeatherMenuDisplay.createMainContainers(
                    mainContainer, 
                    locationContainer, 
                    weatherInfoContainer
                );
                return new Promise(resolve => {
                    locationDOMElements.forEach(async loc => {
                        await WeatherMenuDisplay.addLocationElement(
                            loc, 
                            container, 
                            mainContainer, 
                            locationContainer, 
                            weatherInfoContainer
                        ); 
                        WeatherMenuDisplay.displayToggledElement(); 
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
        Utilities.setPresentForecast(currentForecastContainer, forecast); 
    }; 

    static displayFutureForecast = (
        futureForecast, 
        futureForecastContainer
    ) => {    
        const forecast = futureForecast.slice(0, 3); 
        futureForecastContainer.innerHTML = ""; 
        Utilities.setFutureForecast(futureForecastContainer, forecast); 
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

        const currentTempElement = document.createElement("h1");
        const currentHighLowElement = document.createElement("h6");
        Utilities.setTemp(
            currentTempElement, 
            currentHighLowElement, 
            State.metric, 
            res.presentTemperature, 
            res.highLowTemperature.hi, 
            res.highLowTemperature.low
        );
        tempNumElement.className = "weatherInfoContainerTempDigits"; 
        tempNumElement.appendChild(currentTempElement);
        tempNumElement.appendChild(currentHighLowElement); 
    }; 

    static displayToggledElement = () => {
        const locationsContainer = document.querySelector(".weatherMenuLocationContainer"); 
        const cachedLocation = State.locationStorage.getItem("toggledLocation") && 
                                JSON.parse(State.locationStorage.getItem("toggledLocation"));
         
        cachedLocation && cachedLocation.length && locationsContainer.childNodes.forEach(
            locationElement => {
                if (State.toggledLocation && !State.toggledLocation.textContent.includes(cachedLocation)) State.toggledLocation.style.backgroundColor = "#EEEEEE"; 
                if (locationElement.textContent.includes(cachedLocation)) {
                    locationElement.style.backgroundColor = "#CECCCC"; 
                    State.toggledLocation = locationElement;  
                    WeatherMenuDisplay.displayWeatherLogic(locationElement);
                }
            }
        )
    }; 

    static toggleLocationElement = (
        locationElement
    ) => {
        locationElement.style.backgroundColor = "#CECCCC";
        if (State.toggledLocation) State.toggledLocation.style.backgroundColor = "#EEEEEE"
        const locationText = locationElement
                                .firstChild
                                .querySelector(":nth-child(2)")
                                .firstChild
                                .textContent;
                        
        State.toggledLocation !== locationElement ? 
            (() => {
                State.toggledLocation = locationElement;  
                State.locationStorage.setItem("toggledLocation", JSON.stringify(locationText));
            })() :      
            (() => { 
                State.locationStorage.setItem("toggledLocation", JSON.stringify([]));  
                State.toggledLocation = null; 

                if (State.relPath === "WeatherMenu.html") {
                    const weatherContainer = document.querySelector(".weatherInfoContainer");
                    weatherContainer.innerHTML = ""; 
                    WeatherMenuDisplay.createWeatherInfoContainer(); 
                }
            })();   
    }; 

    static displayWeatherLogic = (
        locationElement
    ) => {
        const [city, state] = locationElement
                                .firstChild
                                .querySelector(":nth-child(2)")
                                .firstChild
                                .textContent
                                .split(",");
        const presentForecast = document.querySelector(".weatherInfoContainerPresentForecast");
        const futureForecast = document.querySelector(".weatherInfoContainerFutureForecast"); 
        const iconElement = document.createElement("i");
        const cityElement = document.createElement("h1"); 
        const timeElement = document.createElement("h3"); 
        const tempNumElement = document.createElement("div"); 

        LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
            .then(res => {
                State.toggledLocation && WeatherMenuDisplay.displayWeatherUtil(
                    res,
                    city, 
                    iconElement, 
                    cityElement, 
                    timeElement, 
                    tempNumElement
                );
                State.toggledLocation && WeatherMenuDisplay.createAdditionalStatsContainer(); 

                const windElement = document.querySelector(".windSpeed"); 
                const rainElement = document.querySelector('.rainVolume'); 
                const humidityElement = document.querySelector(".humidity");
                const cloudyElement = document.querySelector(".cloudiness"); 
                State.toggledLocation && Utilities.setStats(
                    windElement, 
                    rainElement, 
                    humidityElement, 
                    cloudyElement, 
                    "daily", 
                    res.presentTempStats.wind, 
                    res.presentTempStats.rain, 
                    res.presentTempStats.humidity, 
                    res.presentTempStats.clouds
                ); 
                WeatherMenuDisplay.displayCurrentForecast(res.presentForecastStats.list, presentForecast);
                WeatherMenuDisplay.displayFutureForecast(res.futureForecastStats.list, futureForecast); 
            }
        );
        const currentWeatherLocationInfo = document.querySelector(".weatherInfoContainerLocation");
        currentWeatherLocationInfo.innerHTML = '';
        currentWeatherLocationInfo.appendChild(cityElement);
        currentWeatherLocationInfo.appendChild(timeElement);

        const currentWeatherTempInfo = document.querySelector('.weatherInfoContainerTemp');
        currentWeatherTempInfo.innerHTML = '';
        currentWeatherTempInfo.appendChild(iconElement);
        currentWeatherTempInfo.appendChild(tempNumElement); 
    };

    static displayWeather = (
        locationElement
    ) => {
        locationElement.addEventListener("click", () => {
            // if there is a location toggled
            if (State.applicationStatus === State.pageStatus.DELETE && 
                State.toggledLocation && 
                State.toggledLocation !== locationElement) return;
            // if no location toggled 
            else if (State.applicationStatus === State.pageStatus.DELETE &&
                State.deletedLocationElement === locationElement  
            ) return; 
            else if (locationElement.textContent.includes(State.deleteLocationName)) {
                const weatherContainer = document.querySelector(".weatherInfoContainer");
                weatherContainer.innerHTML = ""; 
                WeatherMenuDisplay.createWeatherInfoContainer(); 
                return; 
            }
            WeatherMenuDisplay.displayWeatherLogic(locationElement);
            WeatherMenuDisplay.toggleLocationElement(locationElement);
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
            .then(async data => {
                const [lat, lon] = [data[0].lat, data[0].lon]; 
                const presentWeather = await WeatherRequest.requestCurrentWeather(lat, lon).then(res => res.json());
                const presentForecast = await WeatherRequest.requestCurrentForecast(lat, lon).then(res => res.json());
                const futureForecast = await WeatherRequest.requestFutureForecast(lat, lon).then(res => res.json()); 
                
                if (State.relPath === "WeatherPage.html") {
                    WeatherPage.currentWeather(presentWeather, city); 
                    WeatherPage.dailyForecast(presentForecast); 
                    WeatherPage.weeklyForecastWeather(futureForecast); 
                }

                State.db.add({
                    city: city,
                    state: state,
                    latitude: presentWeather.coord.lat, 
                    longtitude: presentWeather.coord.lon, 
                    currentWeather: presentWeather,
                    currentForecast: presentForecast, 
                    futureForecast: futureForecast 
                })
                console.log("Data added to Firestore"); 
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
        const [formattedCity, formattedState] = [
            city.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" "),
            state.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" ")
        ]; 

        if (!State.locations) {            
            const locationElement = document.createElement("div"); 
            locationElement.className = "weatherMenuLocationElement"; 
            locationElement.textContent = `${city}, ${state}`; 
            // delete the old UI and add the new UI for the locations being existent 
            State.relPath === "WeatherMenu.html" && 
            document.querySelector(".weatherMenuInitContainer").remove(); 
            // save it within local storage 
            const allLocations = LocationStorage.getStorageItem("locations"); 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
            State.locationStorage.setItem("toggledLocation", JSON.stringify(`${formattedCity}, ${formattedState}`));     

            State.applicationStatus = State.pageStatus.ADD; 
            State.locations += 1; 
            (State.relPath === "WeatherMenu.html" && 
            await WeatherMenuDisplay.displayPage() && 
            setTimeout(() => {
                location.reload(); 
            }, 150));
            (State.relPath === "WeatherMap.html" && 
            LocationMap.displayLocations()); 
        } else { 
            const locationElement = document.createElement("div"); 
            locationElement.className = "weatherMenuLocationElement"; 
            locationElement.textContent = `${city}, ${state}`;

            const allLocations = LocationStorage.getStorageItem("locations"); 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations));
            State.locationStorage.setItem("toggledLocation", JSON.stringify(`${formattedCity}, ${formattedState}`));
            
            State.applicationStatus = State.pageStatus.ADD; 
            State.locations += 1; 
            (State.relPath === "WeatherMenu.html" && 
            await WeatherMenuDisplay.displayPage());  
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
            State.relPath === "WeatherPage.html" && Utilities.clearWeather();

            // once parsed use the data to add it to the data 
            // if empty then add otherwise do nothing since it is already within the database
            const [city, state] = [State.cityStatePair["city"], State.cityStatePair["state"]];
            LocationQuery.doesLocationExist(city, state)
                .then(async(res) => {
                    if (res) {
                        await LocationHandler.addToDb(city, state);
                        LocationHandler.saveLocations(city, state); 
                    } else {
                        State.relPath === "WeatherPage.html" && WeatherPage.displayWeather(); 
                        console.log("already exists"); 
                    }
                })
            locationInput.value = ""; 
            console.log("searched for location"); 
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

                const parentElement = document.querySelector(".weatherMenuInitContainer");  
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
            const locationElement = delIconElement
                                    .parentElement
                                    .parentElement; 
            
            const [city, state] = locationElement
                                .firstChild
                                .querySelector(":nth-child(2)")
                                .querySelector(":nth-child(1)")
                                .textContent
                                .split(",");
            LocationQuery.deleteFromDatabase(city.toLowerCase().trim(), state.trim()); 
            LocationStorage.deleteFromLocalStorage(city.trim(), state.trim(), locationClass);
            
            const cachedLocation = JSON.parse(State.locationStorage.getItem("toggledLocation")); 
            if (cachedLocation.includes(city.trim()) && cachedLocation.includes(state.trim())) {
                State.locationStorage.setItem("toggledLocation", JSON.stringify([]));  
                State.toggledLocation = null; 
                State.deleteLocationName = cachedLocation; 
            } else {
                State.deleteLocationName = locationElement
                                        .firstChild
                                        .querySelector(":nth-child(2)")
                                        .firstChild
                                        .textContent;
                State.deletedLocationElement = locationElement;                 
            }
            State.applicationStatus = State.pageStatus.DELETE; 
            State.locations -= 1; 
            if (State.relPath === "WeatherMenu.html" && !State.locations) {
                const locationContainer = document.querySelector(".weatherMenuLocationContainer");
                locationContainer.remove();

                const weatherInfoContainer = document.querySelector(".weatherInfoContainer"); 
                weatherInfoContainer.remove(); 

                WeatherMenuDisplay.displayPage(); 
                LocationHandler.addLocation();
            }
        })
    };  
}; 

State.relPath === "WeatherMenu.html" && 
window.addEventListener("load", () => {
    const setting = new WeatherSettings; 
    setting.displaySettings(); 

    LocationQuery.countLocations()
        .then(async(res) => {
            State.locations = res;
            if (!State.locations) {
                WeatherMenuDisplay.displayPage();
                LocationHandler.addLocation();
            } else {
                await WeatherMenuDisplay.displayPage(); 
                LocationHandler.addLocation();
                WeatherMenuDisplay.displayToggledElement(); 
            }
        })    
    }
); 

export { 
    WeatherMenuDisplay, 
    LocationHandler 
}; 