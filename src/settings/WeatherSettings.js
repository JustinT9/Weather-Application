import { State } from "../util/state.js";
import { 
    LocationStorage, 
    LocationQuery, 
    Utilities 
} from "../util/Utilities.js";

class WeatherSettings {
    constructor() {
        this.displaySetting = false;
    }

    createMetricOptionLogic = () => {
        switch(State.relPath) {
            case "WeatherPage.html": {
                const toggledLocation = State.locationStorage.getItem("toggledLocation") && 
                JSON.parse(State.locationStorage.getItem("toggledLocation"));

                if (!toggledLocation || !toggledLocation.length) return;
                const [city, state] = toggledLocation.split(","); 

                LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                    .then(
                        weatherData => {
                            const {
                                presentWeather,
                                presentForecastStats,
                                futureForecastStats,
                            } = weatherData; 
                            const [
                                tempElement, 
                                minMaxElement
                            ] = [document.querySelector(".tempNum h1"), 
                                document.querySelector(".tempNum h6")];  
                            Utilities.setTemp(
                                tempElement, 
                                minMaxElement, 
                                State.metric, 
                                presentWeather.main.temp, 
                                presentWeather.main.temp_max, 
                                presentWeather.main.temp_min); 
                            State.feelsLikeElement.textContent = `${Math.round(
                                State.metric === "imperial" ? presentWeather.main.feels_like : 
                                Utilities.convertToCelsius(presentWeather.main.feels_like)
                            )}` + "\u00b0"; 

                            const [
                                presentForecastStat, 
                                presentForecastElement
                            ] = [presentForecastStats.list, 
                                document.querySelector(".dailyForecast")];
                            presentForecastElement.childNodes.forEach(
                                (hourlyForecast, idx) => {
                                    hourlyForecast.lastChild ? hourlyForecast.lastChild.textContent = Math.round(
                                        State.metric === "imperial" ? presentForecastStat[idx-1].main.temp : 
                                        Utilities.convertToCelsius(presentForecastStat[idx-1].main.temp)
                                    ) + "\u00b0" : []; 
                                }                                    
                            ); 

                            const [
                                futureForecastStat,
                                futureForecastElement
                            ] = [futureForecastStats.list, 
                                document.querySelector(".forecastWeather")];
                            futureForecastElement.childNodes.forEach(
                                (dailyForecast, idx) => {
                                    dailyForecast.lastChild ? (dailyForecast.lastChild.textContent = `${Math.round(
                                        State.metric === "imperial" ? futureForecastStat[idx-1].temp.max : 
                                        Utilities.convertToCelsius(futureForecastStat[idx-1].temp.max)
                                    ) + "\u00b0"} / ${Math.round(
                                        State.metric === "imperial" ? futureForecastStat[idx-1].temp.min : 
                                        Utilities.convertToCelsius(futureForecastStat[idx-1].temp.min)
                                    ) + "\u00b0"}`) : [];
                                }
                            );
                        }
                    )
                break; 
            } case "WeatherMenu.html": {
                State.applicationStatus = State.pageStatus.SWITCH;
                const locationContainer = document.querySelector(".weatherMenuLocationContainer"); 
                    locationContainer.childNodes.forEach(
                        location => {
                            const [city, state] = location
                                                    .firstChild
                                                    .lastChild
                                                    .firstChild
                                                    .textContent
                                                    .split(","); 
                            LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                                .then(
                                    weatherData => {
                                        const {
                                            presentTemperature,
                                            presentForecastStats,
                                            highLowTemperature,
                                            futureForecastStats 
                                        } = weatherData; 

                                        location.lastChild.firstChild.textContent = (State.metric === "imperial") ? 
                                        `${Math.round(presentTemperature)}` + "\u00b0" + "F" : 
                                        `${Math.round(Utilities.convertToCelsius(presentTemperature))}` + "\u00b0" + "C";
                                    
                                        const toggledLocation = State.locationStorage.getItem("toggledLocation") && 
                                        JSON.parse(State.locationStorage.getItem("toggledLocation"));
                                        if (toggledLocation && toggledLocation.length && 
                                            toggledLocation.split(",")[0] === city && toggledLocation.split(",")[1] === state) {
                                            const presentTemp = document.querySelector(".weatherInfoContainerTempDigits h1");
                                            presentTemp.textContent = (State.metric === "imperial") ? 
                                            `${Math.round(presentTemperature)}` + "\u00b0" + "F" :
                                            `${Math.round(Utilities.convertToCelsius(presentTemperature))}` + "\u00b0" + "C"; 
                    
                                            const highLowTemp = document.querySelector(".weatherInfoContainerTempDigits h6");
                                            highLowTemp.textContent = (State.metric === "imperial") ? 
                                            `${Math.round(highLowTemperature.hi)} \u00b0 / ${Math.round(highLowTemperature.low)}  \u00b0` : 
                                            `${Math.round(Utilities.convertToCelsius(highLowTemperature.hi))} \u00b0 / 
                                            ${Math.round(Utilities.convertToCelsius(highLowTemperature.low))} \u00b0`; 
                                           
                                            const [presentForecast, 
                                                presentForecastElement
                                            ] = [presentForecastStats.list, 
                                                document.querySelector(".weatherInfoContainerPresentForecast")]; 
                                            presentForecastElement.childNodes.forEach(
                                                (hourlyForecast, idx) => {
                                                    const [hourlyTemp, 
                                                            tempElement
                                                    ] = [presentForecast[idx].main.temp, 
                                                        hourlyForecast.lastChild];
                                                    tempElement.textContent = (State.metric === "imperial") ? 
                                                    `${Math.round(hourlyTemp)} \u00b0` : 
                                                    `${Math.round(Utilities.convertToCelsius(hourlyTemp))} \u00b0`; 
                                                }
                                            ); 
                                            
                                            const [futureForecast, 
                                                futureForecastElement
                                            ] = [futureForecastStats.list, 
                                                document.querySelector(".weatherInfoContainerFutureForecast")]; 
                                            futureForecastElement.childNodes.forEach(
                                                (dailyForecast, idx) => {
                                                    const [dailyHi,
                                                           dailyLow,
                                                           tempElement
                                                    ] = [futureForecast[idx].temp.max,
                                                         futureForecast[idx].temp.min,  
                                                         dailyForecast.lastChild];
                                                    tempElement.textContent = (State.metric === "imperial") ?
                                                    `${Math.round(dailyHi)} \u00b0 / ${Math.round(dailyLow)} \u00b0` : 
                                                    `${Math.round(Utilities.convertToCelsius(dailyHi))} \u00b0 / 
                                                    ${Math.round(Utilities.convertToCelsius(dailyLow))} \u00b0`; 
                                                }
                                            ); 
                                
                                        }
                                    }
                                ); 
                            }
                        );
                break; 
            } case "WeatherMap.html":
                const weatherMapLocations = document.querySelector(".weatherMapLocations");
                weatherMapLocations.childNodes.forEach(
                    location => {
                        const [city, state] = location
                                .firstChild
                                .lastChild
                                .firstChild
                                .textContent
                                .split(","); 
                        LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                            .then(
                                weatherData => {
                                    const {
                                        presentTemperature 
                                    } = weatherData; 

                                    const tempElement = location
                                                        .lastChild
                                                        .firstChild; 
                                    tempElement.textContent = (State.metric === "imperial") ?
                                    `${Math.round(presentTemperature)}\u00b0F` :
                                    `${Math.round(Utilities.convertToCelsius(presentTemperature))}\u00b0C`; 
                                }
                            );
                    }
                ); 
                break; 
        }
    }

    createThemeOptionLogic = () => {
        switch(State.relPath) {
            case "WeatherPage.html": {
                break; 
            } case "WeatherMenu.html": {
                break; 
            } case "WeatherMap.html": {
                break; 
            }
        }
    }

    createTimeOptionLogic = () => {
        const toggledLocation = State.locationStorage.getItem("toggledLocation") && 
        JSON.parse(State.locationStorage.getItem("toggledLocation"));

        if (!toggledLocation || !toggledLocation.length) return;
        const [city, state] = toggledLocation.split(","); 
        switch(State.relPath) {
            case "WeatherPage.html": {
                const presentTimeElement = document.querySelector(".weatherPageLocation h3");
                LocationQuery.getLocation(city.toLowerCase().trim(), state.trim())
                    .then(
                        weatherData => {
                            const { 
                                presentWeather,
                                presentForecastStats
                             } = weatherData; 
                            Utilities.setDate(presentTimeElement); 

                            const [
                                sunriseTime,
                                sunsetTime
                            ] = [presentWeather.sys.sunrise, 
                                presentWeather.sys.sunset]; 
                            Utilities.setHighlightTimes(
                                State.sunriseElement, 
                                State.sunsetElement,
                                sunriseTime, 
                                sunsetTime); 

                            const [
                                presentForecastElement,
                                presentForecast
                            ] = [document.querySelector(".dailyForecast"), 
                                presentForecastStats.list]; 
                            presentForecastElement.childNodes.forEach(
                                (hourlyForecast, idx) => { 
                                    const hourlyTimeElement = hourlyForecast.firstChild;
                                    if (idx > 1) {
                                        const hourlyTime = new Date(presentForecast[idx-1].dt * 1000); 
                                        hourlyTimeElement.textContent = (State.timeConvention === State.timeConventions.TWELVE) ? 
                                        ((hourlyTime.toLocaleTimeString().length % 2 === 0) ? 
                                        (`${hourlyTime.toLocaleTimeString().substring(0, 4)} 
                                        ${hourlyTime.toLocaleTimeString().substring(8, hourlyTime.toLocaleTimeString().length)}`) : 
                                        (`${hourlyTime.toLocaleTimeString().substring(0, 5)} 
                                        ${hourlyTime.toLocaleTimeString().substring(9, hourlyTime.length)}`)) : 
                                        Utilities.convertToTwentyFourHourTime(hourlyTime);  
                                    }                              
                                }
                            ); 
                        }
                    ); 
                break; 
            } case "WeatherMenu.html": {
                State.applicationStatus = State.pageStatus.SWITCH; 
                const locationContainer = document.querySelector(".weatherMenuLocationContainer"); 
                locationContainer.childNodes.forEach(
                    location => {
                        const [locationTimeElement,
                               presentTime
                            ] = [location.firstChild.lastChild.lastChild,
                                new Date(Date.now())
                            ]; 
                        locationTimeElement.textContent = State.timeConvention === State.timeConventions.TWELVE ? 
                        ((presentTime.toLocaleTimeString().length % 2 === 0) ? 
                        (`${presentTime.toLocaleTimeString().substring(0, 4)} 
                        ${presentTime.toLocaleTimeString().substring(8, presentTime.toLocaleTimeString().length)}`) : 
                        (`${presentTime.toLocaleTimeString().substring(0, 5)} 
                        ${presentTime.toLocaleTimeString().substring(9, presentTime.length)}`)) : 
                        Utilities.convertToTwentyFourHourTime(presentTime);  
                    }
                );

                const toggledLocation = State.locationStorage.getItem("toggledLocation") && 
                JSON.parse(State.locationStorage.getItem("toggledLocation"));
        
                if (!toggledLocation || !toggledLocation.length) return;
                const [city, state] = toggledLocation.split(","); 
                LocationQuery.getLocation(city.toLowerCase().trim(), state.trim()) 
                    .then(
                        weatherData => {
                            const {
                                presentForecastStats 
                            } = weatherData; 

                            const dateElement = document.querySelector(".weatherInfoContainerLocation h3");
                            Utilities.setDate(dateElement);
            
                            const [presentForecastElement,
                                   presentForecast
                            ] = [document.querySelector(".weatherInfoContainerPresentForecast"), 
                                 presentForecastStats.list];
                            console.log(presentForecastElement.childNodes);
                            presentForecastElement.childNodes.forEach(
                                (hourlyForecast, idx) => {
                                    const hourlyTimeElement = hourlyForecast.firstChild;
                                    if (idx >= 1) {
                                        const hourlyTime = new Date(presentForecast[idx].dt * 1000); 
                                        hourlyTimeElement.textContent = (State.timeConvention === State.timeConventions.TWELVE) ? 
                                        ((hourlyTime.toLocaleTimeString().length % 2 === 0) ? 
                                        (`${hourlyTime.toLocaleTimeString().substring(0, 4)} 
                                        ${hourlyTime.toLocaleTimeString().substring(8, hourlyTime.toLocaleTimeString().length)}`) : 
                                        (`${hourlyTime.toLocaleTimeString().substring(0, 5)} 
                                        ${hourlyTime.toLocaleTimeString().substring(9, hourlyTime.length)}`)) : 
                                        Utilities.convertToTwentyFourHourTime(hourlyTime);  
                                    }
                                }
                            ); 
                        }
                    ); 
                break; 
            } case "WeatherMap.html": {
                State.applicationStatus = State.pageStatus.SWITCH; 
                const locationContainer = document.querySelector(".weatherMapLocations"); 
                locationContainer.childNodes.forEach(
                    location => {
                        const [locationTimeElement,
                               presentTime
                            ] = [location.firstChild.lastChild.lastChild,
                                new Date(Date.now())
                            ]; 
                        locationTimeElement.textContent = State.timeConvention === State.timeConventions.TWELVE ? 
                        ((presentTime.toLocaleTimeString().length % 2 === 0) ? 
                        (`${presentTime.toLocaleTimeString().substring(0, 4)} 
                        ${presentTime.toLocaleTimeString().substring(8, presentTime.toLocaleTimeString().length)}`) : 
                        (`${presentTime.toLocaleTimeString().substring(0, 5)} 
                        ${presentTime.toLocaleTimeString().substring(9, presentTime.length)}`)) : 
                        Utilities.convertToTwentyFourHourTime(presentTime);  
                    }
                );
                break; 
            }
        }
    }

    createLanguageOptionLogic = () => {
        const [
            settingLabelElement,
            metricSettingElement,
            themeSettingElement,
            timeSettingElement,
            languageSettingElement
        ] = [document.querySelector(".weatherSettingsComponent h2"), 
            document.querySelector(".weatherSettingMetricOption h4"),
            document.querySelector(".weatherSettingThemeOption h4"),
            document.querySelector(".weatherSettingTimeOption h4"),
            document.querySelector(".weatherSettingLangOption h4")];
        
        settingLabelElement.textContent = State.language === State.languages.EN ?
            "Settings" : State.englishToSpanishTranslation.Settings; 
        metricSettingElement.textContent = State.language === State.languages.EN ? 
            "Metric" : State.englishToSpanishTranslation.Metric;
        themeSettingElement.textContent = State.language === State.languages.EN ? 
            "Theme" : State.englishToSpanishTranslation.Theme; 
        timeSettingElement.textContent = State.language === State.languages.EN ? 
            "Time Format" : State.englishToSpanishTranslation.TimeFormat; 
        timeSettingElement.style.fontSize = State.language === State.languages.EN ? 
            "1rem" : "0.85rem";
        languageSettingElement.textContent = State.language === State.languages.EN ? 
            "Language" : State.englishToSpanishTranslation.Language; 

        switch(State.relPath) {
            case "WeatherPage.html": {
                const inputElement = document.querySelector(".weather-addLocation");
                inputElement.placeholder = State.language === State.languages.EN ? 
                    "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`;

                const dateElement = document.querySelector(".weatherPageLocation h3");
                Utilities.setDate(dateElement);     
                
                const presentForecastLabelElement = document.querySelector(".dailyContainer h4");
                presentForecastLabelElement.textContent = State.language === State.languages.EN ? 
                    "Today's Forecast" : State.englishToSpanishTranslation.TodayForecast;
                    
                const weatherHighlightLabelELement = document.querySelector(".weatherPageHighlightsContainer h4");
                weatherHighlightLabelELement.textContent = State.language === State.languages.EN ? 
                    "Today's Highlights" : State.englishToSpanishTranslation.TodayHighlights; 

                const highlightsLabel = document.querySelector(".weatherPageHighlightsContainer h4");
                Utilities.setHighlightLabels(
                    highlightsLabel, 
                    State.feelsLikeElement.parentElement, 
                    State.visibilityElement.parentElement,
                    State.sunriseElement.parentElement,
                    State.sunsetElement.parentElement); 

                const presentForecastElement = document.querySelector(".dailyForecast");
                presentForecastElement.childNodes[1].firstChild.textContent = State.language === State.languages.EN ?
                    "Now" : State.englishToSpanishTranslation.Now;

                const futureForecastLabelElement = document.querySelector(".forecastContainer h2");
                futureForecastLabelElement.textContent = State.language === State.languages.EN ?  
                    "Weekly Forecast" : State.englishToSpanishTranslation.WeeklyForecast; 

                const futureForecastDaysElement = document.querySelector(".forecastWeather"); 
                futureForecastDaysElement.childNodes.forEach(
                    (dailyForecast, idx) => {
                        const dailyForecastDay = dailyForecast.firstChild; 
                        if (idx === 1) {
                            dailyForecastDay.textContent = State.language === State.languages.EN ? 
                                "Today" : State.englishToSpanishTranslation.Today; 
                        } else if (idx > 1) {
                            dailyForecastDay.textContent = State.language === State.languages.EN ? 
                                State.dayNames[idx-2] : State.englishToSpanishTranslation.dayNames[idx-2]; 
                        }             
                    }
                );

                break; 
            } case "WeatherMenu.html": {
                const inputElement = document.querySelector(".main-searchWeatherInput");
                inputElement.placeholder = State.language === State.languages.EN ? 
                    "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`;

                const dateElement = document.querySelector(".weatherInfoContainerLocation h3");
                Utilities.setDate(dateElement);

                const presentForecastElement = document.querySelector(".weatherInfoContainerPresentForecast");
                presentForecastElement.childNodes[0].firstChild.textContent = State.language === State.languages.EN ?
                    "Now" : State.englishToSpanishTranslation.Now;

                const futureForecastElement = document.querySelector(".weatherInfoContainerFutureForecast");
                futureForecastElement.childNodes.forEach(
                    (dailyForecast, idx) => {
                        const dailyForecastDay = dailyForecast.firstChild; 
                        if (idx === 0) {
                            dailyForecastDay.textContent = State.language === State.languages.EN ? 
                                "Today" : State.englishToSpanishTranslation.Today; 
                        } else if (idx >= 1) {
                            dailyForecastDay.textContent = State.language === State.languages.EN ? 
                                State.dayNames[idx-1] : State.englishToSpanishTranslation.dayNames[idx-1]; 
                        }    
                    }
                );
                break; 
            } case "WeatherMap.html" : {
                const inputElement = document.querySelector(".weatherMapInput");
                inputElement.placeholder = State.language === State.languages.EN ? 
                    "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`;
            }         
        }
    }

    createOptionLogic = ( 
        labelText
    ) => {
        switch(labelText) {
            case "Metric": 
                State.metric = (State.metric === "metric") ? "imperial" : "metric";  
                State.locationStorage.setItem("metric", JSON.stringify(State.metric));         
                this.createMetricOptionLogic(); 
                break; 
            case "Theme": 
                State.theme = (State.theme === State.themes.light) ? State.themes.dark : State.themes.light; 
                State.locationStorage.setItem("theme", JSON.stringify(State.theme)); 
                this.createThemeOptionLogic();
                break; 
            case "Time Format":
                State.timeConvention = (State.timeConvention === State.timeConventions.TWENTY_FOUR) ? 
                State.timeConventions.TWELVE : State.timeConventions.TWENTY_FOUR; 
                console.log(State.timeConvention); 
                State.locationStorage.setItem("timeConvention", JSON.stringify(State.timeConvention)); 
                this.createTimeOptionLogic(); 
                break; 
            case "Language": 
                State.language = (State.language === State.languages.ES) ?
                State.languages.EN : State.languages.ES;  
                State.locationStorage.setItem("language", JSON.stringify(State.language));
                this.createLanguageOptionLogic(); 
                break; 
        }
    }; 

    createOptionSelectionText(
        labelText, 
        toggleSlider
    ) {
        switch(labelText) {
            case "Metric": 
                const [
                    fahrenheitMetric, 
                    celsiusMetric
                ] = [document.createElement("h5"), 
                    document.createElement("h5")];
                fahrenheitMetric.textContent = "F" + "\u00b0"; 
                toggleSlider.appendChild(fahrenheitMetric); 
                celsiusMetric.textContent = "C" + "\u00b0"; 
                toggleSlider.appendChild(celsiusMetric); 
                break; 
            case "Theme":
                const [
                    darkTheme, 
                    lightTheme
                ] = [document.createElement("h5"), 
                    document.createElement("h5")]; 
                lightTheme.textContent = "LT"; 
                toggleSlider.appendChild(lightTheme); 
                darkTheme.textContent = "DK"; 
                toggleSlider.appendChild(darkTheme); 
                break; 
            case "Time Format": 
                const [
                    twelveHour, 
                    twentyFourHour
                ] = [document.createElement("h5"), 
                    document.createElement("h5")]; 
                twelveHour.textContent = "12"; 
                toggleSlider.appendChild(twelveHour); 
                twentyFourHour.textContent = "24"; 
                toggleSlider.appendChild(twentyFourHour); 
                break; 
            case "Language": 
                const [
                    EN, 
                    ES
                ] = [document.createElement("h5"), 
                    document.createElement("h5")]; 
                EN.textContent = "EN"; 
                toggleSlider.appendChild(EN);
                ES.textContent = "ES"; 
                toggleSlider.appendChild(ES); 
                break; 
        }; 
    };

    toggleOptionSelections(
        labelText, 
        toggleInput
    ) {
        switch(labelText) {
            case "Metric": 
                if (LocationStorage.getStorageItem("metric") === "metric"
                ) toggleInput.checked = true;
                break; 
            case "Theme": 
                break; 
            case "Time Format": 
                if (LocationStorage.getStorageItem("timeConvention") === 
                State.timeConventions.TWENTY_FOUR) toggleInput.checked = true;  
                break; 
            case "Language": 
                if (LocationStorage.getStorageItem("language") ===
                State.languages.ES) toggleInput.checked = true; 
                break; 
        }
    }

    createOptionSelection(
        optionElement, 
        labelText
    ) {
        const toggleSwitch = document.createElement("label"); 
        toggleSwitch.className = "weatherSettingsSwitch"; 
        optionElement.appendChild(toggleSwitch); 

        const toggleInput = document.createElement("input");
        toggleInput.type = "checkbox"; 
        toggleSwitch.appendChild(toggleInput); 
        this.toggleOptionSelections(labelText, toggleInput); 
        
        const toggleSlider = document.createElement("span"); 
        toggleSlider.className = "weatherSettingsSlider"; 
        toggleSwitch.appendChild(toggleSlider); 
        this.createOptionSelectionText(labelText, toggleSlider); 
        
        toggleInput.addEventListener("click", () => this.createOptionLogic(labelText)); 
    }; 

    createOption(
        settingsOptions, 
        optionClassname, 
        labelText,
        displayText
    ) {
        const optionElement = document.createElement("div"); 
        optionElement.className = optionClassname; 
        settingsOptions.appendChild(optionElement); 

        const labelElement = document.createElement("h4"); 
        labelElement.textContent = displayText; 
        optionElement.appendChild(labelElement); 
        this.createOptionSelection(optionElement, labelText); 
    }; 

    displayOptions(settingsComponent) {
        const settingsHeader = document.createElement("h2"); 
        settingsHeader.textContent = State.language === State.languages.EN ? 
            "Settings" : State.englishToSpanishTranslation.Settings; 
        settingsComponent.appendChild(settingsHeader); 

        const settingsOptions = document.createElement("div");
        settingsOptions.className = "weatherSettingsOptions";  
        settingsComponent.appendChild(settingsOptions);

        this.createOption(
            settingsOptions, 
            "weatherSettingMetricOption", 
            "Metric", 
            State.language === State.languages.EN ? "Metric" : State.englishToSpanishTranslation.Metric);
        this.createOption(
            settingsOptions, 
            "weatherSettingThemeOption", 
            "Theme", 
            State.language === State.languages.EN ? "Theme" : State.englishToSpanishTranslation.Theme); 
        this.createOption(
            settingsOptions, 
            "weatherSettingTimeOption",
            "Time Format",
            State.language === State.languages.EN ? "Time Format" : State.englishToSpanishTranslation.TimeFormat); 
        this.createOption(
            settingsOptions, 
            "weatherSettingLangOption", 
            "Language", 
            State.language === State.languages.EN ? "Language" : State.englishToSpanishTranslation.Language);
    }; 

    displaySettings() {
        const settingsComponent = document.createElement("div");
        settingsComponent.className = "weatherSettingsComponent";

        const onSettingsComponentDrag = (e) => {
            const settingsStyle = window.getComputedStyle(settingsComponent);
            const [dx, dy] = [e.movementX, e.movementY]; 
            const [left, top] = [parseInt(settingsStyle.left), parseInt(settingsStyle.top)]; 
            
            settingsComponent.style.left = `${left+dx}px`; 
            settingsComponent.style.top = `${top+dy}px`; 
        };
        
        const settingsElement = document.querySelector(".fa-gear");
        settingsElement.addEventListener("click", () => {
            const applicationContainer = document.body; 
            this.displaySetting ? 
                (
                    () => {
                        ["mousedown", "mouseup"].forEach(
                            type => 
                                settingsComponent.removeEventListener(type, 
                                    () => 
                                        settingsComponent.removeEventListener("mousemove", onSettingsComponentDrag)
                                )
                            ); 
                        settingsComponent.innerHTML = ""; 
                        applicationContainer.removeChild(settingsComponent);
                    }
                )() : 
                (
                    () => {
                        settingsComponent.addEventListener("mousedown", 
                            () => 
                                settingsComponent.addEventListener("mousemove", onSettingsComponentDrag)
                        ); 
                        settingsComponent.addEventListener("mouseup", 
                            () => 
                                settingsComponent.removeEventListener("mousemove", onSettingsComponentDrag)
                        ); 
                        applicationContainer.appendChild(settingsComponent);
                        this.displayOptions(settingsComponent); 
                    }
                )(); 
                this.displaySetting = !this.displaySetting; 
            }
        )
    }; 
};

export { WeatherSettings }; 