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
            const {lat, lon} = weatherData
                            .currentForecastStats
                            .city
                            .coord; 
            LocationMap.loadMapAPI(lat, lon);
        }); 
    }; 

    static displayLocations = () => {
        const weatherMapLocationsElement = document.querySelector(".weatherMapLocations"); 

        // when first loading the map page 
        if (!weatherMapLocationsElement.childNodes.length && State.locations) {
            LocationStorage.getLocationStorage().forEach(location => {
                const [city, state] = new DOMParser()
                                        .parseFromString(location, "text/xml")
                                        .firstChild
                                        .textContent
                                        .split(","); 

                LocationQuery
                    .getLocation(city.trim(), state.trim())
                    .then(res => {                        
                        const locationClassname = ".weatherMapLocations"; 
                        const locationElementClassname = "weatherMapLocationElement";
                        const locationElementRightSectionClassname = "weatherMapLocationElementRightSection"; 
                        const locationElementLeftSectionClassname = "weatherMapLocationElementLeftSection";  
                        const locationElementRightSectionTextClassname = "weatherMapLocationElementRightSectionText";
                        WeatherMenuDisplay.createLocationContainer(
                            res, 
                            weatherMapLocationsElement, 
                            city.trim(), 
                            state.trim(), 
                            locationClassname,
                            locationElementClassname, 
                            locationElementRightSectionClassname, 
                            locationElementLeftSectionClassname, 
                            locationElementRightSectionTextClassname
                        );
                        LocationMap.locateLocation(
                            weatherMapLocationsElement.lastChild,
                            res 
                        ); 
                        console.log(res); 
                    });
            }) 
        // when adding new locations
        } else {
            const formClass = ".weatherMapForm"; 
            const inputClass = ".weatherMapInput"; 
            LocationHandler.inputLocation(formClass, inputClass); 
        }
    };
}; 

window.addEventListener("load", async() => {
    if (State.relPath !== "WeatherMap.html") return; 
    State.locations = LocationStorage.getLocationStorage().length; 
    LocationMap.displayLocations(); 
    console.log(State.locations); 
});

export { LocationMap }; 