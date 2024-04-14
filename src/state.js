import { firebaseApp } from "./config.js";

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
};

let applicationEffects = {
    locations: 0, 
    metric: "imperial", 
    db: firebaseApp.firestore().collection("locations"),  
    applicationStatus: null, 
    currentLocationView: null,
    currentWeather: null, 
    cityStatePair: null,  
    flag: null, 
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
    static get currentLocationView() { return applicationEffects.currentLocationView; }
    static get cityStatePair() { return applicationEffects.cityStatePair; }
    static get flag() { return applicationEffects.flag; }
    static get currentWeather() { return applicationEffects.currentWeather; }

    static set locations(val) { applicationEffects.locations += val }
    static set metric(newMetric) { applicationEffects.metric = newMetric; }
    static set applicationStatus(newStatus) { applicationEffects.applicationStatus = newStatus; }
    static set currentLocationView(newView) { applicationEffects.currentLocationView = newView; }
    static set currentWeather(newWeather) { applicationEffects.currentWeather = newWeather; }
    static set cityStatePair(newPair) { applicationEffects.cityStatePair = newPair; }
    static set flag(newFlag) { applicationEffects.flag = newFlag; }
}

export { State }; 