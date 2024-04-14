import { State } from "./State.js";
import { WeatherRequest } from "./WeatherRequest.js";
import { 
    Utilities, 
    LocationQuery, 
    LocationStorage,
} from "./Utilities.js";
import { todayForecast, todayWeather, weekForecast } from "./TestData.js";

class WeatherMenuDisplay {
    static createMainContainers = (locationContainer, weatherContainer) => {
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

    static createWeatherContainer = () => {
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
            const currentMetricSelector = document.createElement("div"); 
            
            currentHeaderInfo.className = "weatherCurrentInfoHeader";
            currentLocationInfo.className = "weatherCurrentInfoGeo";
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

    static createLocationContainer = (res, locationContainer, city, state) => {
        const rawTime = res.currentTime.toLocaleTimeString(); 
        const rawTimeLength = rawTime.length; 
        const parsedTime = (rawTime.length % 2 === 0) ? 
        (`${rawTime[0]}:${rawTime.substring(2, 4)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`) : 
        (`${rawTime.substring(0, 2)}:${rawTime.substring(3, 5)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`); 
    
        const temperature = Math.round(res.currentTemperature); 
        const iconElement = document.createElement("i"); 
        
        Utilities.setIcon(iconElement, res.weatherCondition);
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
        temperatureTextElement.textContent = (State.metric === "imperial") ? 
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
    
        LocationHandler.addDeleteLocationEvent(deleteIcon); 
        WeatherMenuDisplay.displayWeather(locationElementContainer); 
    }; 

    static addLocationElement = (location, container, locationContainer, weatherContainer) => {
        const locationElement = new DOMParser().parseFromString(location, "text/xml").firstChild;
        const city = locationElement.textContent.split(",")[0].trim(); 
        const state = locationElement.textContent.split(",")[1].trim(); 
        
        return LocationQuery
            .getLocation(city, state)
            .then(res => {
                WeatherMenuDisplay.createLocationContainer(res, locationContainer, city, state); 
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
            const btn = document.createElement("button"); 
    
            initContainer.className = "initialLocationContainer"; 
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
        } else if (State.applicationStatus != State.pageStatus.DELETE) {
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
                        WeatherMenuDisplay.createLocationContainer(res, locationContainer, city, state);
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

    static displayWeatherUtil = (res, city, iconElement, cityElement, timeElement, tempNumElement) => {
        cityElement.textContent = `${city}`; 
        timeElement.textContent = (res.currentTime.toLocaleTimeString().length % 2 === 0) ? 
        (`${State.dayNames[res.currentTime.getDay()]} ${res.currentTime.toLocaleTimeString().substring(0, 4)} 
        ${res.currentTime.toLocaleTimeString().substring(8, res.currentTime.toLocaleTimeString().length)}`) : 
        (`${State.dayNames[res.currentTime.getDay()]} ${res.currentTime.toLocaleTimeString().substring(0, 5)} 
        ${res.currentTime.toLocaleTimeString().substring(9, res.currentTime.toLocaleTimeString().length)}`);
        Utilities.setIcon(iconElement, res.weatherCondition);

        const currentWeatherMetrics = document.querySelector(".weatherCurrentMetrics");
        const fahrenheitIcon = document.createElement("i"); 
        const celsiusIcon = document.createElement("i"); 
        const delimiterText = document.createElement("h5");
        currentWeatherMetrics.innerHTML = ""; 
        delimiterText.textContent = " | "; 
        currentWeatherMetrics.appendChild(fahrenheitIcon); 
        currentWeatherMetrics.appendChild(delimiterText);
        currentWeatherMetrics.appendChild(celsiusIcon); 

        fahrenheitIcon.classList.add("wi", "wi-fahrenheit", "metric-icon"); 
        celsiusIcon.classList.add("wi", "wi-celsius", "metric-icon");                     

        const currentTempElement = document.createElement("h1");
        const currentHighLowElement = document.createElement("h6");

        (State.metric === "imperial") ? 
        currentTempElement.textContent = Math.round(res.currentTemperature) + "\u00b0" + "F": 
        currentTempElement.textContent = Math.round(res.currentTemperature) + "\u00b0" + "C";
        currentHighLowElement.textContent = `${Math.round(res.highLowTemperature.hi)}` + 
        "\u00b0" + " / " + `${Math.round(res.highLowTemperature.low)}` + "\u00b0"; 
        tempNumElement.className = "weatherCurrentTempNums"; 
        tempNumElement.appendChild(currentTempElement);
        tempNumElement.appendChild(currentHighLowElement); 
    }; 

    static displayCurrentForecast = (currentForecast, currentForecastContainer) => {
        const forecast = currentForecast.slice(0, 4); 
        currentForecastContainer.innerHTML = ""; 
        forecast.forEach((f, idx) => {
            const timeElement = document.createElement("h4"); 
            const currentTime = new Date(f.dt * 1000)
                                    .toLocaleString("en-US", "America/New York")
                                    .split(",")[1]
                                    .split(":");         
            const timeSuffix = currentTime[2].split(" ")[1]; 
            const timeDisplay = `${currentTime[0].trim()}:${currentTime[1].trim()} ${timeSuffix}`; 
            timeElement.textContent = idx === 0 ? "Now" : timeDisplay; 
    
            const iconElement = document.createElement("i");
            const weatherDescription = f.weather[0].description; 
            Utilities.setIcon(iconElement, weatherDescription); 
    
            const tempElement = document.createElement("h4"); 
            const tempNum = f.main.temp; 
            tempElement.textContent = `${Math.round(tempNum)}\u00b0`; 
    
            const forecastContainer = document.createElement("div"); 
            forecastContainer.className = "hourlyForecast"; 
            forecastContainer.appendChild(timeElement); 
            forecastContainer.appendChild(iconElement); 
            forecastContainer.appendChild(tempElement); 
    
            currentForecastContainer.appendChild(forecastContainer);
        }); 
        console.log(forecast); 
    }; 

    static displayFutureForecast = (futureForecast, futureForecastContainer) => {    
        const forecast = futureForecast.slice(0, 3); 
        futureForecastContainer.innerHTML = ""; 
    
        forecast.forEach((f, idx) => {
            const dayElement = document.createElement("h4"); 
            const currentDay = State.dayNames[new Date(f.dt * 1000).getDay()]; 
            dayElement.className = "dayContent"; 
            dayElement.textContent = idx === 0 ? "Today" : currentDay;
            
            const iconElement = document.createElement("i");
            const weatherDescription = f.weather[0].description; 
            Utilities.setIcon(iconElement, weatherDescription); 
    
            const highLowElement = document.createElement("h4"); 
            const highTemp = f.temp.max; 
            const lowTemp = f.temp.min; 
            highLowElement.className = "highLowTemp"; 
            highLowElement.textContent = `${Math.round(highTemp)}\u00b0 / ${Math.round(lowTemp)}\u00b0`; 
    
            const forecastContainer = document.createElement("div");
            forecastContainer.className = "forecastDay"; 
            forecastContainer.appendChild(dayElement); 
            forecastContainer.appendChild(iconElement);
            forecastContainer.appendChild(highLowElement); 
            futureForecastContainer.appendChild(forecastContainer); 
    
            console.log(f); 
        });
        console.log(futureForecast); 
    }; 

    static displayWeather = (locationElement) => {
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
    
            LocationQuery.getLocation(city.trim(), state.trim())
                .then(res => {
                    WeatherMenuDisplay.displayWeatherUtil(res, city, iconElement, cityElement, timeElement, tempNumElement);
                    WeatherMenuDisplay.createAdditionalStatsContainer(); 
                    Utilities.setStats("daily", 
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
    static addToDb = (city, state) => {
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
    static saveLocations = async(city, state) => {    
        if (!State.locations) {
            const initContainer = document.querySelector(".initialLocationContainer"); 
            const locationElement = document.createElement("div"); 

            locationElement.className = "locationElement"; 
            locationElement.textContent = `${city}, ${state}`; 
            // delete the old UI and add the new UI for the locations being existent 
            initContainer.remove(); 
            // save it within local storage 
            const allLocations = LocationStorage.getLocationStorage(); 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
            State.applicationStatus = State.pageStatus.ADD; 
            State.locations += 1; 
            await WeatherMenuDisplay.displayPage();
            setTimeout(() => {
                location.reload(); 
            }, 150)
        } else { 
            const locationElement = document.createElement("div"); 
            locationElement.className = "locationElement"; 
            locationElement.textContent = `${city}, ${state}`;

            const allLocations = LocationStorage.getLocationStorage(); 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
            State.applicationStatus = State.pageStatus.ADD; 
            State.locations += 1; 
            WeatherMenuDisplay.displayPage(); 
        }
    }; 

    // now handle the input 
    static inputLocation = (formClassname, inputClassname) => {
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
                LocationQuery.doesLocationExist(city, state)
                    .then(async(res) => {
                        if (res) {
                            await LocationHandler.addToDb(city, state);
                            LocationHandler.saveLocations(city, state); 
                        } else console.log("already exists"); 
                    })
            } 
            locationElement.value = ""; 
        })
    };

    static addLocation = () => {
        // if there are no current locations for weather then initialize 
        if (!State.locations) {
            const btnElement = document.querySelector(".main-addLocation");
    
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
                LocationHandler.inputLocation("." + formElement.className, "." + inputElement.className);
            }); 
        // if there is at least one location within the db then check if it is already 
        // within the database then do nothing otherwise add it 
        } else {
            LocationHandler.inputLocation("." + "main-searchWeatherForm", "." + "main-searchWeatherInput")
        }; 
    }; 
    
    static addDeleteLocationEvent = (delIconElement) => {
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
            LocationStorage.deleteFromLocalStorage(city.trim(), state.trim()); 
            State.applicationStatus = State.pageStatus.DELETE; 
            State.locations -= 1; 
    
            if (!State.locations) {
                const locationContainer = document.querySelector(".locationContainer");
                const weatherContainer = document.querySelector(".weatherContainer"); 
    
                locationContainer.remove();
                weatherContainer.remove(); 
                WeatherMenuDisplay.displayPage(); 
                LocationHandler.addLocation();
            }
        })
    };  
}; 

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