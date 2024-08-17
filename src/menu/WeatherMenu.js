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
        const [
            searchWeatherForm,
            searchWeatherInput
        ] = [
            document.createElement("form"),
            document.createElement("input")
        ];  

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
            const [
                currentWeatherInfoSection, 
                currentWeatherForecast,
                futureWeatherForecast, 
                currentHeaderInfo, 
                currentLocationInfo, 
                currentTempInfo, 
                currentAdditionalInfo
            ] = [
                document.createElement("div"),
                document.createElement("div"), 
                document.createElement("div"), 
                document.createElement("div"), 
                document.createElement("div"), 
                document.createElement("div"),
                document.createElement("div")
            ]; 

            currentWeatherInfoSection.className = "weatherInfoContainerMainSection";
            currentWeatherForecast.className = "weatherInfoContainerPresentForecast";
            futureWeatherForecast.className = "weatherInfoContainerFutureForecast";

            currentHeaderInfo.className = "weatherInfoContainerHeader";
            currentWeatherInfoSection.appendChild(currentHeaderInfo);

            currentLocationInfo.className = "weatherInfoContainerLocation";
            currentHeaderInfo.appendChild(currentLocationInfo);

            currentTempInfo.className = "weatherInfoContainerTemp";        
            currentWeatherInfoSection.appendChild(currentTempInfo);
    
            currentAdditionalInfo.className = "weatherInfoContainerStats"; 
            currentWeatherInfoSection.appendChild(currentAdditionalInfo);
        
            weatherInfoContainer.appendChild(currentWeatherInfoSection); 
            weatherInfoContainer.appendChild(currentWeatherForecast);
            weatherInfoContainer.appendChild(futureWeatherForecast);
        }
    }; 

    static createAdditionalStatsContainer = () => {   
        const [
            windSpeedContainer, 
            windIcon, 
            rainVolumeContainer, 
            rainIcon, 
            humidityContainer, 
            humidIcon, 
            cloudinessContainer, 
            cloudyIcon, 
            outerContainer, 
            windNum, 
            rainNum, 
            humidNum, 
            cloudyNum
        ] = [
            document.createElement("div"), 
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div"), 
            document.createElement("div"),
            document.createElement("div"), 
            document.querySelector(".weatherInfoContainerStats"), 
            document.createElement("h6"),
            document.createElement("h6"), 
            document.createElement("h6"), 
            document.createElement("h6")
        ];  

        windSpeedContainer.className = "weatherInfoContainerIndividualStat";
        windIcon.classList.add("wi", "wi-windy", "climate-icon");
        windSpeedContainer.appendChild(windIcon); 

        rainVolumeContainer.className = "weatherInfoContainerIndividualStat";
        rainIcon.classList.add("wi", "wi-rain", "climate-icon");
        rainVolumeContainer.appendChild(rainIcon);
        
        humidityContainer.className = "weatherInfoContainerIndividualStat";
        humidIcon.classList.add("wi", "wi-humidity", "climate-icon");
        humidityContainer.appendChild(humidIcon); 

        cloudinessContainer.className = "weatherInfoContainerIndividualStat";
        cloudyIcon.classList.add("wi", "wi-cloudy", "climate-icon");
        cloudinessContainer.appendChild(cloudyIcon);

        outerContainer.innerHTML = "";

        windNum.className = "windSpeed";
        windSpeedContainer.appendChild(windNum)
        outerContainer.appendChild(windSpeedContainer);

        rainNum.className = "rainVolume";
        rainVolumeContainer.appendChild(rainNum);
        outerContainer.appendChild(rainVolumeContainer);

        humidNum.className = "humidity";
        humidityContainer.appendChild(humidNum);
        outerContainer.appendChild(humidityContainer); 

        cloudyNum.className = "cloudiness"; 
        cloudinessContainer.appendChild(cloudyNum); 
        outerContainer.appendChild(cloudinessContainer); 
    };

    static createLocationContainer = (
        city, 
        state, 
        weatherData, 
        mainContainer, 
        locationContainer, 
        locationClass, 
        locationElementClass, 
        weatherMenuLocationElementRightSectionClassname, 
        weatherMenuLeftLocationElementLeftSectionClassname, 
        weatherMenuLocationElementRightSectionTextClassname, 
    ) => {      
        const [
            weatherMenuLocationElementRightSection, 
            weatherMenuLocationElementRightSectionText, 
            locationElement, 
            presentTime, 
            presentTimeElement, 
            iconElement, 
            weatherMenuLocationElementLeftSection, 
            tempElement, 
            temp, 
            deleteIcon, 
            locationElementContainer
        ] = [
            document.createElement("div"), 
            document.createElement("div"), 
            document.createElement("h2"), 
            weatherData.presentTime.toLocaleTimeString(), 
            document.createElement("h4"), 
            document.createElement("i"),
            document.createElement("div"), 
            document.createElement("h1"), 
            Math.round(weatherData.presentTemperature), 
            document.createElement("i"), 
            document.createElement("div")
        ]; 
        weatherMenuLocationElementRightSection.className = weatherMenuLocationElementRightSectionClassname; 
        weatherMenuLocationElementRightSectionText.className = weatherMenuLocationElementRightSectionTextClassname;  

        locationElement.textContent = `${city}, ${state}`; 
        city.split(" ").forEach(
            (word, idx) => {
                if (idx === 0) locationElement.textContent = "";
                locationElement.textContent += `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`; 
                if (idx < city.split(" ").length-1) locationElement.textContent += " ";
            }
        ); 
        locationElement.textContent += `, ${state}`; 
        weatherMenuLocationElementRightSectionText.appendChild(locationElement); 

        const parsedTime = State.timeConvention === State.timeConventions.TWELVE ? 
            presentTime.length % 2 === 0 ? 
                `${presentTime[0]}:${presentTime.substring(2, 4)} ${presentTime.substring(presentTime.length-2, presentTime.length)}` : 
                `${presentTime.substring(0, 2)}:${presentTime.substring(3, 5)} ${presentTime.substring(presentTime.length-2, presentTime.length)}` : 
            Utilities.convertToTwentyFourHourTime(weatherData.presentTime); 
        presentTimeElement.textContent = `${parsedTime}`; 
        weatherMenuLocationElementRightSectionText.appendChild(presentTimeElement); 

        Utilities.setIcon(iconElement, weatherData.weatherCondition);
        iconElement.className = `${iconElement.className}`;  
        weatherMenuLocationElementRightSection.appendChild(iconElement); 
        weatherMenuLocationElementRightSection.appendChild(weatherMenuLocationElementRightSectionText);   
        weatherMenuLocationElementLeftSection.className = weatherMenuLeftLocationElementLeftSectionClassname;

        Utilities.setMainTempWithSymbol(
            tempElement,
            temp, 
            State.metric
        );
        weatherMenuLocationElementLeftSection.appendChild(tempElement); 

        deleteIcon.className = "fa-solid fa-xmark";
        weatherMenuLocationElementLeftSection.appendChild(deleteIcon); 

        locationElementContainer.className = locationElementClass; 
        locationElementContainer.appendChild(weatherMenuLocationElementRightSection); 
        locationElementContainer.appendChild(weatherMenuLocationElementLeftSection); 
        locationContainer.appendChild(locationElementContainer); 

        LocationHandler.addDeleteLocationEvent(deleteIcon, locationClass);
        State.relPath === "WeatherMenu.html" && mainContainer.appendChild(locationContainer); 
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
        const [
            city, 
            state
        ] = [
            locationElement.textContent.split(",")[0].trim(), 
            locationElement.textContent.split(",")[1].trim()
        ]; 

        return LocationQuery.getLocation(
            city, 
            state
        ).then(
            res => {
                WeatherMenuDisplay.createLocationContainer(
                    city, 
                    state, 
                    res, 
                    mainContainer, 
                    locationContainer, 
                    ".weatherMenuLocationContainer", 
                    "weatherMenuLocationElement", 
                    "weatherMenuLocationElementRightSection", 
                    "weatherMenuLocationElementLeftSection", 
                    "weatherMenuLocationElementRightSectionText"
                ); 
                container.appendChild(mainContainer); 
                container.appendChild(weatherInfoContainer);
                WeatherMenuDisplay.createWeatherInfoContainer();   
                return new Promise(resolve => resolve(1)); 
            }
        )
        .catch(err => console.log(err)); 
    }; 

    static displayPage = async() => {
        const container = document.querySelector(".container"); 
        if (!State.locations) {
            const [
                btn, 
                initContainer
            ] = [
                document.createElement("button"), 
                document.createElement("div")
            ]; 
            btn.className = "main-addLocation";
            btn.innerHTML = "<i class='fa-solid fa-plus addIcon'></i>Add Location"; 

            initContainer.className = "weatherMenuInitContainer"; 
            initContainer.appendChild(btn); 
            container.appendChild(initContainer);    
            State.applicationStatus = State.pageStatus.INIT; 

            return new Promise(resolve => resolve(1)); 
        } else if (State.locations === 1) {    
            const [
                mainContainer, 
                locationContainer, 
                weatherInfoContainer, 
                locationElements
             ] = [
                document.createElement("div"), 
                document.createElement("div"), 
                document.createElement("div"), 
                LocationStorage.getStorageItem("locations")
            ]; 
            await WeatherMenuDisplay.createMainContainers(
                mainContainer, 
                locationContainer, 
                weatherInfoContainer
            );

            // Must return promise so it can wait upon this operation to complete synchronously
            return new Promise(
                async resolve => {
                    await WeatherMenuDisplay.addLocationElement(
                        locationElements[0], 
                        container, 
                        mainContainer, 
                        locationContainer, 
                        weatherInfoContainer
                    ); 
                    WeatherMenuDisplay.displayToggledElement(); 
                    resolve(1); 
                }
            );
        } else if (State.applicationStatus !== State.pageStatus.DELETE) {
            const [
                mainContainer, 
                locationContainer,
                locationElements
            ] = [
                document.querySelector(".weatherMenuMainContainer"), 
                document.querySelector(".weatherMenuLocationContainer"), 
                LocationStorage.getStorageItem("locations")
            ];  
            if (mainContainer && locationContainer && State.applicationStatus !== State.pageStatus.SWITCH) {
                return new Promise(resolve => {
                    const locationElement = new DOMParser().parseFromString(locationElements[locationElements.length-1], "text/xml").firstChild;
                    const [
                        city, 
                        state
                    ] = [
                        locationElement.textContent.split(",")[0].trim(), 
                        locationElement.textContent.split(",")[1].trim()
                    ]; 
                    LocationQuery.getLocation(
                        city, 
                        state
                    ).then(
                        res => {
                            WeatherMenuDisplay.createLocationContainer(
                                city, 
                                state, 
                                res, 
                                mainContainer,
                                locationContainer, 
                                ".weatherMenuLocationContainer", 
                                "weatherMenuLocationElement", 
                                "weatherMenuLocationElementRightSection", 
                                "weatherMenuLocationElementLeftSection", 
                                "weatherMenuLocationElementRightSectionText"
                            );
                            WeatherMenuDisplay.displayToggledElement(); 
                            resolve(1); 
                        }
                    )
                    .catch(err => console.log(err)); 
                    }
                ); 
            // If reloaded, then you have to retrieve the locationContainer from the 
            // localStorage as it is not saved when first loading into the page if 
            // there are location elements stored within the localStorage 
            } else if (State.applicationStatus !== State.pageStatus.SWITCH) {
                const [
                    mainContainer, 
                    locationContainer, 
                    weatherInfoContainer
                ] = [
                    document.createElement("div"), 
                    document.createElement("div"), 
                    document.createElement("div")
                ]; 
                WeatherMenuDisplay.createMainContainers(
                    mainContainer, 
                    locationContainer, 
                    weatherInfoContainer
                );
                return new Promise(
                    resolve => {
                        locationElements.forEach(
                            async location => {
                                await WeatherMenuDisplay.addLocationElement(
                                    location, 
                                    container, 
                                    mainContainer, 
                                    locationContainer, 
                                    weatherInfoContainer
                                ); 
                                WeatherMenuDisplay.displayToggledElement(); 
                                resolve(1); 
                            }
                        );
                    }
                ); 
            } else if (State.applicationStatus === State.pageStatus.SWITCH) {
                const [
                    locationContainer, 
                    weatherInfoContainer
                ] = [
                    document.querySelector(".weatherMenuLocationContainer"), 
                    document.querySelector(".weatherInfoContainer")
                ]; 
                locationContainer.innerHTML = "";
                return new Promise(
                    resolve => {
                        locationElements.forEach(
                            async location => {
                                await WeatherMenuDisplay.addLocationElement(
                                    location, 
                                    container, 
                                    mainContainer, 
                                    locationContainer, 
                                    weatherInfoContainer
                                ); 
                                WeatherMenuDisplay.displayToggledElement(); 
                                State.applicationStatus = State.pageStatus.INIT;
                                resolve(1);  
                            }
                        ); 
                    }
                ); 
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
        weatherData, 
        city, 
        iconElement, 
        cityElement, 
        timeElement, 
        tempNumElement
    ) => {
        const [
            currentTempElement, 
            currentHighLowElement
        ] = [
            document.createElement("h1"), 
            document.createElement("h6")
        ];

        Utilities.setInfo(
            cityElement, 
            timeElement, 
            city
        );
        Utilities.setIcon(
            iconElement, 
            weatherData.weatherCondition
        );
        Utilities.setTemp(
            currentTempElement, 
            currentHighLowElement, 
            State.metric, 
            weatherData.presentTemperature, 
            weatherData.highLowTemperature.hi, 
            weatherData.highLowTemperature.low
        );
        tempNumElement.className = "weatherInfoContainerTempDigits"; 
        tempNumElement.appendChild(currentTempElement);
        tempNumElement.appendChild(currentHighLowElement); 
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
        const [
            iconElement, 
            cityElement, 
            timeElement, 
            tempNumElement, 
            presentForecast, 
            futureForecast
        ] = [
            document.createElement("i"), 
            document.createElement("h1"), 
            document.createElement("h3"), 
            document.createElement("div"), 
            document.querySelector(".weatherInfoContainerPresentForecast"), 
            document.querySelector(".weatherInfoContainerFutureForecast")
        ]; 

        LocationQuery.getLocation(
            city.toLowerCase().trim(), 
            state.trim()
        ).then(
            res => {
                State.toggledLocation && 
                WeatherMenuDisplay.displayWeatherUtil(
                    res,
                    city, 
                    iconElement, 
                    cityElement, 
                    timeElement, 
                    tempNumElement
                );

                State.toggledLocation && 
                WeatherMenuDisplay.createAdditionalStatsContainer(); 

                const [
                    windElement, 
                    rainElement, 
                    humidityElement,
                    cloudyElement
                ] = [
                    document.querySelector(".windSpeed"), 
                    document.querySelector('.rainVolume'), 
                    document.querySelector(".humidity"), 
                    document.querySelector(".cloudiness")
                ]; 

                State.toggledLocation && 
                Utilities.setStats(
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
                WeatherMenuDisplay.displayCurrentForecast(
                    res.presentForecastStats.list, 
                    presentForecast
                );
                WeatherMenuDisplay.displayFutureForecast(
                    res.futureForecastStats.list, 
                    futureForecast
                ); 
            }
        );
        const [
            currentWeatherLocationInfo, 
            currentWeatherTempInfo
        ] = [
            document.querySelector(".weatherInfoContainerLocation"), 
            document.querySelector('.weatherInfoContainerTemp')
        ]; 
        currentWeatherLocationInfo.innerHTML = '';
        currentWeatherLocationInfo.appendChild(cityElement);
        currentWeatherLocationInfo.appendChild(timeElement);

        currentWeatherTempInfo.innerHTML = '';
        currentWeatherTempInfo.appendChild(iconElement);
        currentWeatherTempInfo.appendChild(tempNumElement); 
    };

    static displayToggledElement = () => {
        const [
            locationsContainer, 
            toggledLocation
        ] = [
            document.querySelector(".weatherMenuLocationContainer"), 
            Utilities.getToggledLocation()
        ];

        toggledLocation && 
        toggledLocation.length && 
        locationsContainer.childNodes.forEach(
            locationElement => {
                if (State.toggledLocation && !State.toggledLocation.textContent.includes(toggledLocation)) {
                    State.toggledLocation.style.backgroundColor = "#EEEEEE";
                } if (locationElement.textContent.includes(toggledLocation)) {
                    locationElement.style.backgroundColor = "#CECCCC"; 
                    State.toggledLocation = locationElement;  
                    WeatherMenuDisplay.displayWeatherLogic(locationElement);
                }; 
            }
        );
    }; 

    static toggleLocationElement = (
        locationElement
    ) => {
        if (State.toggledLocation) State.toggledLocation.style.backgroundColor = "#EEEEEE"
        locationElement.style.backgroundColor = "#CECCCC";
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

    static displayWeather = (
        locationElement
    ) => {
        locationElement.addEventListener("click", () => {
            // If there is a location toggled
            if (State.applicationStatus === State.pageStatus.DELETE && 
                State.toggledLocation && 
                State.toggledLocation !== locationElement) return;
            // If no location toggled 
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
                const [
                    presentWeather,
                    presentForecast,
                    futureForecast 
                ] = [
                    await WeatherRequest.requestPresentWeather(lat, lon).then(res => res.json()), 
                    await WeatherRequest.requestPresentForecast(lat, lon).then(res => res.json()), 
                    await WeatherRequest.requestFutureForecast(lat, lon).then(res => res.json())
                ];  
                
                if (State.relPath === "WeatherPage.html") {
                    WeatherPage.presentWeather(presentWeather, city); 
                    WeatherPage.presentForecast(presentForecast); 
                    WeatherPage.weeklyForecastWeather(futureForecast); 
                }; 

                State.db.add(
                    {
                        city: city,
                        state: state,
                        latitude: presentWeather.coord.lat, 
                        longtitude: presentWeather.coord.lon, 
                        presentWeather: presentWeather,
                        presentForecast: presentForecast, 
                        futureForecast: futureForecast 
                    }
                ); 
                console.log("Data added to Firestore."); 
                resolve(1); 
            })
            .catch(err => console.log(err)); 
        })
    }; 

    // Store it within the localStorage and because storage updates, then reload the DOM 
    static saveLocations = async(
        city, 
        state
    ) => {    
        const [formattedCity, formattedState] = [
            city.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" "),
            state.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" ")
        ]; 

        if (!State.locations) {            
            const [
                locationElement,  
                allLocations
            ] = [
                document.createElement("div"), 
                LocationStorage.getStorageItem("locations")
            ]; 
            locationElement.className = "weatherMenuLocationElement"; 
            locationElement.textContent = `${city}, ${state}`; 
            // delete the old UI and add the new UI for the locations being existent 
            State.relPath === "WeatherMenu.html" && 
            document.querySelector(".weatherMenuInitContainer").remove(); 
            // save it within local storage 
            allLocations.push(locationElement.outerHTML); 
            State.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
            State.locationStorage.setItem("toggledLocation", JSON.stringify(`${formattedCity}, ${formattedState}`));     
            State.locationStorage.setItem("metric", JSON.stringify(State.metric)); 
            State.locationStorage.setItem("timeConvention", JSON.stringify(State.timeConvention)); 
            State.locationStorage.setItem("language", JSON.stringify(State.language)); 
            State.locationStorage.setItem("theme", JSON.stringify(State.theme)); 

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
            const [
                locationElement, 
                allLocations
            ] = [
                document.createElement("div"), 
                LocationStorage.getStorageItem("locations")
            ]; 
            locationElement.className = "weatherMenuLocationElement"; 
            locationElement.textContent = `${city}, ${state}`;

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

    // Handle the input 
    static inputLocation = (
        formClassname, 
        inputClassname
    ) => {
        const [
            formElement, 
            locationInput
        ] = [
            document.querySelector(formClassname),
            document.querySelector(inputClassname)
        ];
            
        locationInput.placeholder = State.language === State.languages.EN ?
            "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`; 

        formElement.addEventListener("submit", (e) => { 
            e.preventDefault(); 

            // parsing matters now with the user input with location 
            const parsedLocationInput = document.querySelector(inputClassname).value.trim();
            Utilities.parseInput(parsedLocationInput); 
            State.relPath === "WeatherPage.html" && Utilities.clearWeather();

            // Once parsed use the data to add it to the data and if empty then add otherwise 
            // do nothing since it is already within the database
            const [
                city, 
                state
            ] = [
                State.cityStatePair["city"], 
                State.cityStatePair["state"]
            ];
            WeatherPage.callWeatherData(city, state); 
            locationInput.value = ""; 
            console.log("Searched for location."); 
        })
    };

    static addLocation = () => {
        // If there are no current locations for weather then initialize 
        if (!State.locations) {
            const btnElement = document.querySelector(".main-addLocation");
            btnElement.addEventListener("click", async() => {
                const [
                    formElement, 
                    inputElement,
                    parentElement
                ] = [
                    document.createElement("form"), 
                    document.createElement("input"), 
                    document.querySelector(".weatherMenuInitContainer")
                ]; 
                formElement.className = "main-inputWrapper"; 
                inputElement.className = "main-inputLocation"; 
                inputElement.placeholder = State.language === State.languages.EN ? 
                    "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`; 
                
                btnElement.remove();
                formElement.appendChild(inputElement); 
                parentElement.appendChild(formElement); 
                // now handle the input 
                LocationHandler.inputLocation("." + formElement.className, "." + inputElement.className);
            }); 
        // if there is at least one location within the db then check if it is already 
        // within the database then do nothing otherwise add it 
        } else LocationHandler.inputLocation("." + "main-searchWeatherForm", "." + "main-searchWeatherInput"); 
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
            
            const toggledLocation = JSON.parse(State.locationStorage.getItem("toggledLocation")); 
            if (toggledLocation.includes(city.trim()) && toggledLocation.includes(state.trim())) {
                State.locationStorage.setItem("toggledLocation", JSON.stringify([]));  
                State.toggledLocation = null; 
                State.deleteLocationName = toggledLocation; 
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
                const [
                    locationContainer, 
                    weatherInfoContainer
                ] = [
                    document.querySelector(".weatherMenuLocationContainer"), 
                    document.querySelector(".weatherInfoContainer")
                ];
                locationContainer.remove();
                weatherInfoContainer.remove(); 
                
                WeatherMenuDisplay.displayPage(); 
                LocationHandler.addLocation();
            }
        })
    };  
}; 

State.relPath === "WeatherMenu.html" && 
window.addEventListener("load", 
    () => {
        const setting = new WeatherSettings; 
        setting.displaySettings(); 

        State.metric = LocationStorage.getStorageItem("metric"); 
        State.timeConvention = LocationStorage.getStorageItem("timeConvention"); 
        State.language = LocationStorage.getStorageItem("language");

        LocationQuery.countLocations()
            .then(
                async(res) => {
                    State.locations = res;
                    if (!State.locations) {
                        WeatherMenuDisplay.displayPage();
                        LocationHandler.addLocation();
                        WeatherPage.getCurrentLocation(); 
                    } else {
                        await WeatherMenuDisplay.displayPage(); 
                        LocationHandler.addLocation();
                        WeatherMenuDisplay.displayToggledElement();
                        WeatherPage.getCurrentLocation();  
                    }
                }
            );    
    }
); 

export { 
    WeatherMenuDisplay, 
    LocationHandler 
}; 