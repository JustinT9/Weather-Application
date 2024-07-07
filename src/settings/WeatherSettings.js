import { State } from "../util/state.js";
import { LocationStorage, Utilities } from "../util/Utilities.js";
import { WeatherPage } from "../page/WeatherPage.js";
import { WeatherMenuDisplay } from "../menu/WeatherMenu.js";
import { LocationMap } from "../map/WeatherMap.js";

class WeatherSettings {
    constructor() {
        this.displaySetting = false;
    }

    async createOptionLogic( 
        labelText
    ) {
        switch(labelText) {
            case "Metric": 
                State.metric === "metric" ? State.metric = "imperial" : State.metric = "metric";  
                State.locationStorage.setItem("metric", JSON.stringify(State.metric)); 
                if (State.relPath === "WeatherPage.html") {
                    Utilities.clearWeather(); 
                    WeatherPage.displayWeather();  
                } else if (State.relPath === "WeatherMenu.html") {
                    State.applicationStatus = State.pageStatus.SWITCH; 
                    await WeatherMenuDisplay.displayPage(); 
                } else if (State.relPath === "WeatherMap.html") {
                    State.applicationStatus = State.pageStatus.SWITCH; 
                    LocationMap.displayLocations(); 
                }
                break; 
            case "Theme": 
                
                break; 
            case "Time Format":
                State.timeConvention === State.timeConventions.TWENTY_FOUR ? 
                State.timeConvention = State.timeConventions.TWELVE :
                State.timeConvention = State.timeConventions.TWENTY_FOUR; 
                State.locationStorage.setItem("timeConvention", JSON.stringify(State.timeConvention)); 
                if (State.relPath === "WeatherPage.html") {
                    Utilities.clearWeather(); 
                    WeatherPage.displayWeather(); 
                } else if (State.relPath === "WeatherMenu.html") {
                    State.applicationStatus = State.pageStatus.SWITCH; 
                    await WeatherMenuDisplay.displayPage(); 
                } else if (State.relPath === "WeatherMap.html") {
                    State.applicationStatus = State.pageStatus.SWITCH; 
                    LocationMap.displayLocations(); 
                }
                break; 
            case "Language": 
                break; 
        }
    }; 

    createOptionSelectionText(
        labelText, 
        toggleSlider
    ) {
        switch(labelText) {
            case "Metric": 
                const [fahrenheitMetric, celsiusMetric] = [document.createElement("h5"), document.createElement("h5")];
                fahrenheitMetric.textContent = "F" + "\u00b0"; 
                toggleSlider.appendChild(fahrenheitMetric); 
                celsiusMetric.textContent = "C" + "\u00b0"; 
                toggleSlider.appendChild(celsiusMetric); 
                break; 
            case "Theme":
                const [darkTheme, lightTheme] = [document.createElement("h5"), document.createElement("h5")]; 
                lightTheme.textContent = "LT"; 
                toggleSlider.appendChild(lightTheme); 
                darkTheme.textContent = "DK"; 
                toggleSlider.appendChild(darkTheme); 
                break; 
            case "Time Format": 
                const [twelveHour, twentyFourHour] = [document.createElement("h5"), document.createElement("h5")]; 
                twelveHour.textContent = "12"; 
                toggleSlider.appendChild(twelveHour); 
                twentyFourHour.textContent = "24"; 
                toggleSlider.appendChild(twentyFourHour); 
                break; 
            case "Language": 
                const [EN, ES] = [document.createElement("h5"), document.createElement("h5")]; 
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
        labelText
    ) {
        const optionElement = document.createElement("div"); 
        optionElement.className = optionClassname; 
        settingsOptions.appendChild(optionElement); 

        const labelElement = document.createElement("h4"); 
        labelElement.textContent = labelText; 
        optionElement.appendChild(labelElement); 
        this.createOptionSelection(optionElement, labelText); 
    }; 

    displayOptions(settingsComponent) {
        const settingsHeader = document.createElement("h2"); 
        settingsHeader.textContent = "Settings"; 
        settingsComponent.appendChild(settingsHeader); 

        const settingsOptions = document.createElement("div");
        settingsOptions.className = "weatherSettingsOptions";  
        settingsComponent.appendChild(settingsOptions);

        this.createOption(settingsOptions, "weatherSettingMetricOption", "Metric");
        this.createOption(settingsOptions, "weatherSettingThemeOption", "Theme"); 
        this.createOption(settingsOptions, "weatherSettingTimeOption", "Time Format"); 
        this.createOption(settingsOptions, "weatherSettingLangOption", "Language");
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