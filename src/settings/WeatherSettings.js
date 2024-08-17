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

    weatherPageMetricOptionLogic = () => {
        const toggledLocation = Utilities.getToggledLocation();
        if (!toggledLocation || !toggledLocation.length) return;
        const [city, state] = toggledLocation.split(","); 

        LocationQuery.getLocation(
            city.toLowerCase().trim(), 
            state.trim()
        ).then(
            weatherData => {
                const {
                    presentWeather,
                    presentForecastStats,
                    futureForecastStats,
                } = weatherData; 
                const [
                    tempElement, 
                    minMaxElement,
                    presentForecastStat, 
                    presentForecastElement,
                    futureForecastStat,
                    futureForecastElement
                ] = [
                    document.querySelector(".tempNum h1"), 
                    document.querySelector(".tempNum h6"),
                    presentForecastStats.list, 
                    document.querySelector(".dailyForecast"),
                    futureForecastStats.list, 
                    document.querySelector(".forecastWeather")
                ];  
                Utilities.setTemp(
                    tempElement, 
                    minMaxElement, 
                    State.metric, 
                    presentWeather.main.temp, 
                    presentWeather.main.temp_max, 
                    presentWeather.main.temp_min
                ); 
                Utilities.setMainTempWithoutSymbol(
                    State.feelsLikeElement, 
                    presentWeather.main.feels_like, 
                    State.metric
                );
                presentForecastElement.childNodes.forEach(
                    (hourlyForecast, idx) => {
                        hourlyForecast.lastChild ? 
                            Utilities.setMainTempWithoutSymbol(
                                hourlyForecast.lastChild,
                                presentForecastStat[idx-1].main.temp, 
                                State.metric
                            ) : []; 
                    }                                    
                ); 
                futureForecastElement.childNodes.forEach(
                    (dailyForecast, idx) => {
                        dailyForecast.lastChild ? 
                            Utilities.setHighLowTemp(
                                dailyForecast.lastChild,
                                futureForecastStat[idx-1].temp.max,
                                futureForecastStat[idx-1].temp.min,
                                State.metric
                            ) : [];
                    }
                );
            }
        ); 
    }; 

    weatherMenuMetricOptionLogic = () => {
        const locationContainer = document.querySelector(".weatherMenuLocationContainer"); 
                
        locationContainer.childNodes.forEach(
            location => {
                const [city, state] = location
                                        .firstChild
                                        .lastChild
                                        .firstChild
                                        .textContent
                                        .split(","); 
                LocationQuery.getLocation(
                    city.toLowerCase().trim(), 
                    state.trim()
                ).then(
                    weatherData => {
                        const {
                            presentTemperature,
                            presentForecastStats,
                            highLowTemperature,
                            futureForecastStats 
                        } = weatherData; 
                        const toggledLocation = Utilities.getToggledLocation(); 

                        Utilities.setMainTempWithSymbol(
                            location.lastChild.firstChild, 
                            presentTemperature, 
                            State.metric
                        );                                 
                        if (toggledLocation && 
                            toggledLocation.length && 
                            toggledLocation.split(",")[0] === city && 
                            toggledLocation.split(",")[1] === state
                        ) {
                            const [
                                presentTemp,
                                highLowTemp,
                                presentForecast, 
                                presentForecastElement, 
                                futureForecast, 
                                futureForecastElement
                            ] = [
                                document.querySelector(".weatherInfoContainerTempDigits h1"), 
                                document.querySelector(".weatherInfoContainerTempDigits h6"),
                                presentForecastStats.list, 
                                document.querySelector(".weatherInfoContainerPresentForecast"), 
                                futureForecastStats.list, 
                                document.querySelector(".weatherInfoContainerFutureForecast")
                            ];
                            
                            Utilities.setMainTempWithSymbol(
                                presentTemp, 
                                presentTemperature, 
                                State.metric
                            );
                            Utilities.setHighLowTemp(
                                highLowTemp, 
                                highLowTemperature.hi, 
                                highLowTemperature.low, 
                                State.metric
                            ); 
                        
                            presentForecastElement.childNodes.forEach(
                                (hourlyForecast, idx) => {
                                    const [
                                        hourlyTemp, 
                                        tempElement
                                    ] = [
                                        presentForecast[idx].main.temp, 
                                        hourlyForecast.lastChild
                                    ];
                                    Utilities.setMainTempWithoutSymbol(
                                        tempElement, 
                                        hourlyTemp, 
                                        State.metric
                                    ); 
                                }
                            ); 
                        
                            futureForecastElement.childNodes.forEach(
                                (dailyForecast, idx) => {
                                    const [
                                        dailyHi,
                                        dailyLow,
                                        tempElement
                                    ] = [
                                        futureForecast[idx].temp.max,
                                        futureForecast[idx].temp.min,  
                                        dailyForecast.lastChild
                                    ];
                                    Utilities.setHighLowTemp(
                                        tempElement, 
                                        dailyHi, 
                                        dailyLow, 
                                        State.metric
                                    ); 
                                }
                            ); 
                        }
                    }
                ); 
            }
        );
        State.applicationStatus = State.pageStatus.SWITCH;
    }; 
    
    weatherMapMetricOptionLogic = () => {
        const weatherMapLocations = document.querySelector(".weatherMapLocations");

        weatherMapLocations.childNodes.forEach(
            location => {
                const [city, state] = location
                                      .firstChild
                                      .lastChild
                                      .firstChild
                                      .textContent
                                      .split(","); 
                LocationQuery.getLocation(
                    city.toLowerCase().trim(), 
                    state.trim()
                ).then(
                    weatherData => {
                        const [
                            { presentTemperature }, 
                            tempElement
                        ] = [
                            weatherData, 
                            location.lastChild.firstChild
                        ]; 
                        Utilities.setMainTempWithSymbol(
                            tempElement, 
                            presentTemperature, 
                            State.metric
                        ); 
                    }
                );
            }
        ); 
    }; 

    createMetricOptionLogic = () => {
        switch(State.relPath) {
            case "WeatherPage.html": 
                this.weatherPageMetricOptionLogic(); 
                break; 
            case "WeatherMenu.html": 
                this.weatherMenuMetricOptionLogic(); 
                break; 
            case "WeatherMap.html":
                this.weatherMapMetricOptionLogic(); 
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

    weatherPageTimeOptionLogic = (
        city, 
        state
    ) => {
        LocationQuery.getLocation(
            city.toLowerCase().trim(), 
            state.trim()
        ).then(
            weatherData => {
                const { 
                    presentWeather,
                    presentForecastStats
                } = weatherData; 
                const [
                    presentTimeElement,
                    sunriseTime,
                    sunsetTime,
                    presentForecastElement,
                    presentForecast
                ] = [
                    document.querySelector(".weatherPageLocation h3"),
                    presentWeather.sys.sunrise, 
                    presentWeather.sys.sunset,
                    document.querySelector(".dailyForecast"), 
                    presentForecastStats.list
                ];

                Utilities.setDate(presentTimeElement); 
                Utilities.setHighlightTimes(
                    State.sunriseElement, 
                    State.sunsetElement,
                    sunriseTime, 
                    sunsetTime); 
                presentForecastElement.childNodes.forEach(
                    (hourlyForecast, idx) => { 
                        const hourlyTimeElement = hourlyForecast.firstChild;
                        if (idx > 1) {
                            const hourlyTime = new Date(presentForecast[idx-1].dt * 1000); 
                            Utilities.setTimeWithoutSuffix(hourlyTimeElement, hourlyTime); 
                        }                              
                    }
                ); 
            }
        ); 
    }; 

    weatherMenuTimeOptionLogic = () => {
        const locationContainer = document.querySelector(".weatherMenuLocationContainer"); 
        locationContainer.childNodes.forEach(
            location => {
                const [
                    locationTimeElement,
                    presentTime
                ] = [
                    location.firstChild.lastChild.lastChild,
                    new Date(Date.now())
                ]; 
                Utilities.setTimeWithoutSuffix(locationTimeElement, presentTime); 
            }
        );

        const toggledLocation = Utilities.getToggledLocation(); 
        if (!toggledLocation || !toggledLocation.length) return;

        const [city, state] = toggledLocation.split(","); 
        LocationQuery.getLocation(
            city.toLowerCase().trim(), 
            state.trim()
        ) .then(
            weatherData => {
                const { presentForecastStats } = weatherData; 
                const [
                    dateElement,
                    presentForecastElement,
                    presentForecast
                ] = [
                    document.querySelector(".weatherInfoContainerLocation h3"),
                    document.querySelector(".weatherInfoContainerPresentForecast"), 
                    presentForecastStats.list
                ];
                Utilities.setDate(dateElement);
                presentForecastElement.childNodes.forEach(
                    (hourlyForecast, idx) => {
                        const hourlyTimeElement = hourlyForecast.firstChild;
                        if (idx >= 1) {
                            const hourlyTime = new Date(presentForecast[idx].dt * 1000); 
                            Utilities.setTimeWithoutSuffix(hourlyTimeElement, hourlyTime); 
                        }
                    }
                ); 
            }
        ); 
        State.applicationStatus = State.pageStatus.SWITCH; 
    }; 

    weatherMapTimeOptionLogic = () => {
        const locationContainer = document.querySelector(".weatherMapLocations"); 
        locationContainer.childNodes.forEach(
            location => {
                const [
                    locationTimeElement,
                    presentTime
                ] = [
                    location.firstChild.lastChild.lastChild,
                    new Date(Date.now())
                ];
                Utilities.setTimeWithoutSuffix(locationTimeElement, presentTime);  
            }
        );
        State.applicationStatus = State.pageStatus.SWITCH; 
    }; 

    createTimeOptionLogic = () => {
        const toggledLocation = Utilities.getToggledLocation(); 
        if (!toggledLocation || !toggledLocation.length) return;

        const [city, state] = toggledLocation.split(","); 
        switch(State.relPath) {
            case "WeatherPage.html": 
                this.weatherPageTimeOptionLogic(city, state);  
                break; 
            case "WeatherMenu.html": 
                this.weatherMenuTimeOptionLogic(); 
                break; 
            case "WeatherMap.html": {
                this.weatherMapTimeOptionLogic();
                break; 
            }
        }
    }

    weatherPageLanguageOptionLogic = () => {
        const [
            inputElement,
            dateElement,
            presentForecastLabelElement,
            weatherHighlightLabelElement,
            highlightsLabel,
            presentForecastElement,
            futureForecastLabelElement,
            futureForecastDaysElement
        ] = [
            document.querySelector(".weather-addLocation"),
            document.querySelector(".weatherPageLocation h3"),
            document.querySelector(".dailyContainer h4"),
            document.querySelector(".weatherPageHighlightsContainer h4"),
            document.querySelector(".weatherPageHighlightsContainer h4"),
            document.querySelector(".dailyForecast"),
            document.querySelector(".forecastContainer h2"),
            document.querySelector(".forecastWeather")
        ];
        inputElement.placeholder = State.language === State.languages.EN ? 
            "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`;
        Utilities.setDate(dateElement);     
        presentForecastLabelElement.textContent = State.language === State.languages.EN ? 
            "Today's Forecast" : State.englishToSpanishTranslation.TodayForecast;
        weatherHighlightLabelElement.textContent = State.language === State.languages.EN ? 
            "Today's Highlights" : State.englishToSpanishTranslation.TodayHighlights;
        Utilities.setHighlightLabels(
            highlightsLabel, 
            State.feelsLikeElement.parentElement, 
            State.visibilityElement.parentElement,
            State.sunriseElement.parentElement,
            State.sunsetElement.parentElement); 
        presentForecastElement.childNodes[1].firstChild.textContent = State.language === State.languages.EN ?
            "Now" : State.englishToSpanishTranslation.Now;
        futureForecastLabelElement.textContent = State.language === State.languages.EN ?  
            "Weekly Forecast" : State.englishToSpanishTranslation.WeeklyForecast; 
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
    }; 

    weatherMenuLanguageOptionLogic = () => {
        const [
            inputElement,
            dateElement,
            presentForecastElement,
            futureForecastElement
        ] = [
            document.querySelector(".main-searchWeatherInput"),
            document.querySelector(".weatherInfoContainerLocation h3"),
            document.querySelector(".weatherInfoContainerPresentForecast"),
            document.querySelector(".weatherInfoContainerFutureForecast")
        ];
        inputElement.placeholder = State.language === State.languages.EN ? 
            "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`;
        Utilities.setDate(dateElement);
        presentForecastElement.childNodes[0].firstChild.textContent = State.language === State.languages.EN ?
            "Now" : State.englishToSpanishTranslation.Now;
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
    }; 

    weatherMapLanguageOptionLogic = () => {
        const inputElement = document.querySelector(".weatherMapInput");
        inputElement.placeholder = State.language === State.languages.EN ? 
            "City, State..." : `${State.englishToSpanishTranslation.City}, ${State.englishToSpanishTranslation.State}...`;
    }; 

    createLanguageOptionLogic = () => {
        const [
            settingLabelElement,
            metricSettingElement,
            themeSettingElement,
            timeSettingElement,
            languageSettingElement
        ] = [
            document.querySelector(".weatherSettingsComponent h2"), 
            document.querySelector(".weatherSettingMetricOption h4"),
            document.querySelector(".weatherSettingThemeOption h4"),
            document.querySelector(".weatherSettingTimeOption h4"),
            document.querySelector(".weatherSettingLangOption h4")
        ];
        
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
                this.weatherPageLanguageOptionLogic(); 
                break; 
            } case "WeatherMenu.html": {
                this.weatherMenuLanguageOptionLogic(); 
                break; 
            } case "WeatherMap.html" : {
                this.weatherMapLanguageOptionLogic(); 
                break;
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
                ] = [
                    document.createElement("h5"), 
                    document.createElement("h5")
                ];
                fahrenheitMetric.textContent = "F" + "\u00b0"; 
                toggleSlider.appendChild(fahrenheitMetric); 
                celsiusMetric.textContent = "C" + "\u00b0"; 
                toggleSlider.appendChild(celsiusMetric); 
                break; 
            case "Theme":
                const [
                    darkTheme, 
                    lightTheme
                ] = [
                    document.createElement("h5"), 
                    document.createElement("h5")
                ]; 
                lightTheme.textContent = "LT"; 
                toggleSlider.appendChild(lightTheme); 
                darkTheme.textContent = "DK"; 
                toggleSlider.appendChild(darkTheme); 
                break; 
            case "Time Format": 
                const [
                    twelveHour, 
                    twentyFourHour
                ] = [
                    document.createElement("h5"), 
                    document.createElement("h5")
                ]; 
                twelveHour.textContent = "12"; 
                toggleSlider.appendChild(twelveHour); 
                twentyFourHour.textContent = "24"; 
                toggleSlider.appendChild(twentyFourHour); 
                break; 
            case "Language": 
                const [
                    EN, 
                    ES
                ] = [
                    document.createElement("h5"), 
                    document.createElement("h5")
                ]; 
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
                if (LocationStorage.getStorageItem("timeConvention") === State.timeConventions.TWENTY_FOUR
                ) toggleInput.checked = true;  
                break; 
            case "Language": 
                if (LocationStorage.getStorageItem("language") === State.languages.ES
                ) toggleInput.checked = true; 
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

    showSettings = (
        settingsComponent,
        onSettingsComponentDrag,
        applicationContainer 
    ) => {
        ["mousedown", "mouseup"].forEach(
            type => 
                settingsComponent.removeEventListener(type, 
                    () => 
                        settingsComponent.removeEventListener("mousemove", onSettingsComponentDrag)
                )
            ); 
        settingsComponent.innerHTML = ""; 
        applicationContainer.removeChild(settingsComponent);
    }; 

    hideSettings = (
        settingsComponent, 
        onSettingsComponentDrag,
        applicationContainer
    ) => {
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
                    this.showSettings(
                        settingsComponent,
                        onSettingsComponentDrag,
                        applicationContainer
                    )
                   : 
                    this.hideSettings(
                        settingsComponent,
                        onSettingsComponentDrag,
                        applicationContainer
                    )
                this.displaySetting = !this.displaySetting; 
            }
        )
    }; 
};

export { WeatherSettings }; 