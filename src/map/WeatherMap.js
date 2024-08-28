import { maps_key } from "../../config.js"; 
import { State } from "../util/state.js";
import { LocationQuery, LocationStorage, Utilities } from "../util/Utilities.js";
import { WeatherSettings } from "../settings/WeatherSettings.js";
import { WeatherMenuDisplay, LocationHandler } from "../menu/WeatherMenu.js"; 
import { WeatherPage } from "../page/WeatherPage.js";

class LocationMap {
    static loadMap = (
        lat, 
        lon
    ) => {
        return new Promise(
            resolve => {
                let script = document.createElement("script"); 
                script.src = `https://maps.googleapis.com/maps/api/js?key=${maps_key}&loading=async&callback=initMap`;
                script.async = true; 
                script.className = "mapScript";

                window.initMap = async() => {
                    const { Map } = await google.maps.importLibrary("maps");
                    new Map(document.querySelector(".weatherMap"), {
                        center: { lat: lat, lng: lon },
                        zoom: 8, 
                        mapTypeId: State.mapType
                    });
                }; 
                document.body.appendChild(script);

                resolve(1); 
            }
        );
    };

    static selectedMapType = () => {
        const mapSelector = document.querySelector(".weatherMapSelection"); 
        mapSelector.value = State.mapTypesMapper[State.mapType]; 
        mapSelector.addEventListener("change", e => {
            switch (e.target.value) {
                case "Default":
                    State.mapType = State.mapTypes.Default; 
                    break; 
                case "Satellite": 
                    State.mapType = State.mapTypes.Satellite; 
                    break; 
                case "Hybrid": 
                    State.mapType = State.mapTypes.Hybrid; 
                    break; 
                case "Terrain": 
                    State.mapType = State.mapTypes.Terrain; 
                    break; 
                default: 
                    break; 
            } 
            State.locationStorage.setItem("mapType", JSON.stringify(State.mapType)); 

            const toggledLocation = Utilities.getToggledLocation();  
            if (toggledLocation.length === 0) return; 

            const [toggledCity, toggledState] = toggledLocation.split(",");
            LocationQuery.getLocation(
                toggledCity.toLowerCase().trim(), 
                toggledState.trim()
            ).then(
                weatherData => {
                    const [
                        { lat, lon }, 
                        script 
                    ] = [
                        weatherData
                        .presentForecastStats
                        .city
                        .coord, 
                        document.querySelector(".mapScript")
                    ]; 
                    document.body.removeChild(script); 
                    this.loadMap(lat, lon); 
                }
            ); 
        }); 
    }; 

    static locateLocation = (
        weatherData,
        locationElement 
    ) => {
        locationElement.addEventListener("click", () => {
            if (
                State.applicationStatus === State.pageStatus.DELETE && 
                State.deletedLocationElement === locationElement && 
                State.toggledLocation && 
                State.toggledLocation !== locationElement
            ) return;
            else if (
                State.applicationStatus === State.pageStatus.DELETE &&
                State.deletedLocationElement === locationElement
            ) return; 
            WeatherMenuDisplay.toggleLocationElement(locationElement);
            
            const {
                city, 
                state
            } = weatherData.location; 
            const {
                lat, 
                lon
            } = weatherData
                .presentForecastStats
                .city
                .coord; 
            const toggledLocation = JSON.parse(State.locationStorage.getItem("toggledLocation"));
            toggledLocation.length && 
            toggledLocation.toLowerCase().includes(city) && 
            toggledLocation.includes(state) && 
            LocationMap.loadMap(lat, lon);
        }); 
    }; 

    static displayToggledLocation = (
        city, 
        state,
        weatherData, 
        locationElement
    ) => {  
        const toggledLocation = Utilities.getToggledLocation();  
        if (toggledLocation.length === 0) return; 

        const [toggledCity, toggledState] = toggledLocation.split(",");
        if ((toggledCity === city || toggledCity.toLowerCase() === city) && toggledState.trim() === state) {
            const {lat, lon} = weatherData  
                                .presentForecastStats
                                .city
                                .coord; 
            if (State.toggledLocation) State.toggledLocation.style.backgroundColor = "#EEEEEE"; 
            locationElement.style.backgroundColor = "#CECCCC"; 
            State.toggledLocation = locationElement;
            LocationMap.loadMap(lat, lon); 
        }
    }; 

    static displayLocationsLogic = (
        city, 
        state,
        weatherMapLocationsElement
    ) => {
        LocationQuery.getLocation(
            city.toLowerCase().trim(), 
            state.trim()
        ).then(
            weatherData => {
                WeatherMenuDisplay.createLocationContainer(
                    city.trim(), 
                    state.trim(), 
                    weatherData, 
                    null, 
                    weatherMapLocationsElement, 
                    ".weatherMapLocations",
                    "weatherMapLocationElement", 
                    "weatherMapLocationElementRightSection", 
                    "weatherMapLocationElementLeftSection", 
                    "weatherMapLocationElementRightSectionText"
                );
                LocationMap.locateLocation(
                    weatherData, 
                    weatherMapLocationsElement.lastChild
                ); 
                LocationMap.displayToggledLocation(
                    city.trim(), 
                    state.trim(), 
                    weatherData, 
                    weatherMapLocationsElement.lastChild
                );  
            }
        )
    };  

    static displayLocations = () => {
        const [
            weatherMapLocationsElement, 
            toggledLocation
        ] = [
            document.querySelector(".weatherMapLocations"), 
            Utilities.getToggledLocation()
        ]; 

        // When first loading the map page 
        if (!weatherMapLocationsElement.childNodes.length && State.locations) {
            LocationHandler.inputLocation(".weatherMapForm", ".weatherMapInput"); 
            LocationStorage.getStorageItem("locations").forEach(
                location => {
                    const [
                        city, 
                        state
                    ] = new DOMParser()
                        .parseFromString(location, "text/xml")
                        .firstChild
                        .textContent
                        .split(","); 
                    LocationMap.displayLocationsLogic(city, state, weatherMapLocationsElement); 
                }
            );
        } else if (toggledLocation.length && State.applicationStatus !== State.pageStatus.SWITCH) {
            const [toggledCity, toggledState] = toggledLocation.split(",");
            LocationMap.displayLocationsLogic(toggledCity, toggledState, weatherMapLocationsElement);
        } else if (State.applicationStatus === State.pageStatus.SWITCH) {
            weatherMapLocationsElement.innerHTML = ""; 
            LocationStorage.getStorageItem("locations").forEach(
                location => {
                    const [
                        city, 
                        state
                    ] = new DOMParser()
                        .parseFromString(location, "text/xml")
                        .firstChild
                        .textContent
                        .split(","); 
                    LocationMap.displayLocationsLogic(city, state, weatherMapLocationsElement); 
                } 
            );
            State.applicationStatus = State.pageStatus.INIT; 
        }
    }     
}; 

State.relPath === "WeatherMap.html" && 
window.addEventListener("load", 
    () => {
        const setting = new WeatherSettings;
        setting.displaySettings(); 

        State.locations = LocationStorage.getStorageItem("locations").length;
        State.metric = LocationStorage.getStorageItem("metric"); 
        State.timeConvention = LocationStorage.getStorageItem("timeConvention"); 
        State.language = LocationStorage.getStorageItem("language");
        State.mapType = LocationStorage.getStorageItem("mapType"); 
        
        LocationMap.displayLocations(); 
        WeatherPage.getCurrentLocation(); 
        LocationMap.selectedMapType(); 
    }
);

export { LocationMap }; 