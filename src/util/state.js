import { firebaseApp } from "../../config.js";

const applicationStates = {
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 
    proxyURL: "https://cors-anywhere.herokuapp.com/", 
    locationStorage: localStorage,  
    relPath: window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1), 
    pageStatus: Object.freeze({
        INIT: 0, 
        ADD: 1, 
        DELETE: 2, 
    }), 
    windElement: document.querySelector(".windSpeed"), 
    rainElement: document.querySelector(".rainVolume"),  
    humidityElement: document.querySelector(".humidity"),
    cloudyElement: document.querySelector(".cloudiness"), 
    feelsLikeElement: document.querySelector(".feelslike h4"),  
    visibilityElement: document.querySelector(".visible h4"),   
    sunriseElement: document.querySelector(".sunrise h4"),  
    sunsetElement: document.querySelector(".sunset h4"), 
};

let applicationEffects = {
    locations: 0, 
    metric: "imperial", 
    db: firebaseApp.firestore().collection("locations"),  
    applicationStatus: null, 
    currentWeather: null, 
    cityStatePair: null,  
    flag: null, 
    toggledLocation: null, 
}; 
 
class State {
    static get proxyURL() { return applicationStates.proxyURL; } 
    static get dayNames() { return applicationStates.dayNames; }
    static get db() { return applicationEffects.db; }
    static get locationStorage() { return applicationStates.locationStorage; }
    static get pageStatus() { return applicationStates.pageStatus; }
    static get relPath() { return applicationStates.relPath; }
    static get locations() { return applicationEffects.locations; }
    static get metric() { return applicationEffects.metric; }
    static get applicationStatus() { return applicationEffects.applicationStatus; }
    static get cityStatePair() { return applicationEffects.cityStatePair; }
    static get flag() { return applicationEffects.flag; }
    static get currentWeather() { return applicationEffects.currentWeather; }
    static get windElement() { return applicationStates.windElement; }
    static get rainElement() { return applicationStates.rainElement; }
    static get humidityElement() { return applicationStates.humidityElement; }
    static get cloudyElement() { return applicationStates.cloudyElement; }
    static get feelsLikeElement() { return applicationStates.feelsLikeElement; }
    static get visibilityElement() { return applicationStates.visibilityElement; }
    static get sunriseElement() { return applicationStates.sunriseElement; }
    static get sunsetElement() { return applicationStates.sunsetElement; }
    static get toggledLocation() { return applicationEffects.toggledLocation; }

    static set locations(val) { applicationEffects.locations += val }
    static set metric(newMetric) { applicationEffects.metric = newMetric; }
    static set applicationStatus(newStatus) { applicationEffects.applicationStatus = newStatus; }
    static set currentWeather(newWeather) { applicationEffects.currentWeather = newWeather; }
    static set cityStatePair(newPair) { applicationEffects.cityStatePair = newPair; }
    static set flag(newFlag) { applicationEffects.flag = newFlag; }
    static set toggledLocation(newToggledLocation) { applicationEffects.toggledLocation = newToggledLocation; }
}

export { State }; 