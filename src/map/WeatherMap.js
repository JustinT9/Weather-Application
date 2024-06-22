import { maps_key } from "../../config.js"; 
import { State } from "../util/state.js";
import { LocationQuery, LocationStorage } from "../util/Utilities.js";
import { WeatherMenuDisplay, LocationHandler } from "../menu/WeatherMenu.js"; 
import { WeatherSettings } from "../settings/WeatherSettings.js";

class LocationMap {      
    static loadMapAPI = (
        lat, 
        lon
    ) => {
        return new Promise(resolve => {
            let script = document.createElement("script"); 
            script.src = `https://maps.googleapis.com/maps/api/js?key=${maps_key}&loading=async&callback=initMap`;
            script.async = true; 
    
            window.initMap = async() => {
                const { Map } = await google.maps.importLibrary("maps");
                new Map(document.querySelector(".weatherMap"), {
                    center: { lat: lat, lng: lon },
                    zoom: 8,
                  });
            }; 
    
            document.body.appendChild(script);
            resolve(1); 
        })
    };

    static locateLocation = (
        locationElement, 
        weatherData 
    ) => {
        locationElement.addEventListener("click", () => {
            if (State.applicationStatus === State.pageStatus.DELETE && 
                State.deletedLocationElement === locationElement && 
                State.toggledLocation && 
                State.toggledLocation !== locationElement) return;
            else if (State.applicationStatus === State.pageStatus.DELETE &&
                State.deletedLocationElement === locationElement
            ) return; 

            const {lat, lon} = weatherData
                                .presentForecastStats
                                .city
                                .coord; 
            const {city, state} = weatherData.location; 

            WeatherMenuDisplay.toggleLocationElement(locationElement);
            const toggledLocation = JSON.parse(State.locationStorage.getItem("toggledLocation"));
            
            toggledLocation.length && 
            toggledLocation.toLowerCase().includes(city) && 
            toggledLocation.includes(state) && 
            LocationMap.loadMapAPI(lat, lon);
        }); 
    }; 

    static displayToggledLocation = (
        locationElement, 
        weatherData, 
        city, 
        state
    ) => {  
        const cachedLocation = JSON.parse(State.locationStorage.getItem("toggledLocation"));  
        if (cachedLocation.length === 0) return; 

        const [cachedCity, cachedState] = cachedLocation.split(",");
        if ((cachedCity === city || cachedCity.toLowerCase() === city) && cachedState.trim() === state) {
            const {lat, lon} = weatherData  
                                .presentForecastStats
                                .city
                                .coord; 

            locationElement.style.backgroundColor = "#CECCCC"; 
            if (State.toggledLocation) State.toggledLocation.style.backgroundColor = "#EEEEEE"; 
            State.toggledLocation = locationElement;
            // LocationMap.loadMapAPI(lat, lon); 
        }
    }; 

    static displayLocationsLogic = (
        city, 
        state,
        weatherMapLocationsElement
    ) => {
        LocationQuery
            .getLocation(city.toLowerCase().trim(), state.trim())
            .then(weatherData => {
                const locationClassname = ".weatherMapLocations"; 
                const locationElementClassname = "weatherMapLocationElement";
                const locationElementRightSectionClassname = "weatherMapLocationElementRightSection"; 
                const locationElementLeftSectionClassname = "weatherMapLocationElementLeftSection";  
                const locationElementRightSectionTextClassname = "weatherMapLocationElementRightSectionText";
                WeatherMenuDisplay.createLocationContainer(
                    weatherData, 
                    null, 
                    weatherMapLocationsElement, 
                    city.trim(), 
                    state.trim(), 
                    locationClassname,
                    locationElementClassname, 
                    locationElementRightSectionClassname, 
                    locationElementLeftSectionClassname, 
                    locationElementRightSectionTextClassname
                );
                // add eventlistener to display map 
                LocationMap.locateLocation(
                    weatherMapLocationsElement.lastChild,
                    weatherData 
                ); 
                LocationMap.displayToggledLocation(
                    weatherMapLocationsElement.lastChild, 
                    weatherData,
                    city.trim(), 
                    state.trim()
                );  
            })
    };  

    static displayLocations = () => {
        const weatherMapLocationsElement = document.querySelector(".weatherMapLocations"); 
        const cachedLocation = JSON.parse(State.locationStorage.getItem("toggledLocation")); 

        // when first loading the map page 
        if (!weatherMapLocationsElement.childNodes.length && State.locations) {
            // when adding new locations by adding an eventlistener
            const [formClass, inputClass] = [".weatherMapForm", ".weatherMapInput"]; 
            LocationHandler.inputLocation(formClass, inputClass); 

            LocationStorage.getStorageItem("locations").forEach(
                location => {
                    const [city, state] = new DOMParser()
                                            .parseFromString(location, "text/xml")
                                            .firstChild
                                            .textContent
                                            .split(","); 
                    LocationMap.displayLocationsLogic(
                        city,
                        state,
                        weatherMapLocationsElement
                    ); 
                });
        } else if (JSON.parse(State.locationStorage.getItem("toggledLocation")).length) {
            const [cachedCity, cachedState] = cachedLocation.split(",");
            LocationMap.displayLocationsLogic(
                cachedCity,
                cachedState,
                weatherMapLocationsElement
            );
        }
    }     
}; 

window.addEventListener("load", async() => {
    if (State.relPath !== "WeatherMap.html") return; 
    const setting = new WeatherSettings;
    setting.displaySettings(); 

    State.locations = LocationStorage.getStorageItem("locations").length; 
    LocationMap.displayLocations(); 
});

export { LocationMap }; 