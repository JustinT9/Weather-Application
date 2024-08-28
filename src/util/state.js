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
        SWITCH: 3, 
    }), 
    timeConvention: Object.freeze({
        TWELVE: 0, 
        TWENTY_FOUR: 1,
    }),
    language: Object.freeze({
        EN: 0,
        ES: 1, 
    }), 
    themes: Object.freeze({
        light: 0, 
        dark: 1, 
    }), 
    englishToSpanishTranslation: {
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], 
        City: "Ciudad",
        State: "Estado",
        Now: "Ahora",
        Today: "Hoy", 
        TodayForecast: "Pronóstico de hoy",
        TodayHighlights: "Lo más destacado de hoy",
        WeeklyForecast: "Pronóstico Semanal",
        FeelsLike: "Se siente como",
        Visibility: "Visibilidad",
        Sunrise: "Amanecer",
        Sunset: "Atardecer",
        Settings: "Ajustes",
        Metric: "Métrico",
        Theme: "Tema",
        TimeFormat: "Formato de tiempo",
        Language: "Idioma", 
    },
    mapTypes: Object.freeze({
        Default: "roadmap", 
        Satellite: "satellite", 
        Hybrid: "hybrid", 
        Terrain: "terrain" 
    }),
    mapTypesMapper: Object.freeze({
        roadmap: "Default", 
        satellite: "Satellite", 
        hybrid: "Hybrid", 
        terrain: "Terrain" 
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
    deletedLocationName: null,
    deletedLocationElement: null,
    timeConvention: applicationStates.timeConvention.TWELVE,
    language: applicationStates.language.EN, 
    theme: applicationStates.themes.light, 
    mapType: applicationStates.mapTypes.Default, 
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
    static get deletedLocationName() { return applicationEffects.deletedLocationName; }
    static get deletedLocationElement() { return applicationEffects.deletedLocationElement; }
    static get timeConventions() { return applicationStates.timeConvention; }
    static get timeConvention() { return applicationEffects.timeConvention; }
    static get languages() { return applicationStates.language; }
    static get language() { return applicationEffects.language; }
    static get themes() { return applicationStates.themes; }
    static get theme() { return applicationEffects.theme; }
    static get englishToSpanishTranslation() { return applicationStates.englishToSpanishTranslation; }
    static get mapTypes() { return applicationStates.mapTypes; }
    static get mapType() { return applicationEffects.mapType; }
    static get mapTypesMapper() { return applicationStates.mapTypesMapper; }

    static set locations(val) { applicationEffects.locations += val }
    static set metric(newMetric) { applicationEffects.metric = newMetric; }
    static set applicationStatus(newStatus) { applicationEffects.applicationStatus = newStatus; }
    static set currentWeather(newWeather) { applicationEffects.currentWeather = newWeather; }
    static set cityStatePair(newPair) { applicationEffects.cityStatePair = newPair; }
    static set flag(newFlag) { applicationEffects.flag = newFlag; }
    static set toggledLocation(newToggledLocation) { applicationEffects.toggledLocation = newToggledLocation; }
    static set deletedLocationName(newDeletedLocationName) { applicationEffects.deletedLocationName = newDeletedLocationName; }
    static set deletedLocationElement(newDeletedLocationElement) { applicationEffects.deletedLocationElement = newDeletedLocationElement; }
    static set timeConvention(newTimeConvention) { applicationEffects.timeConvention = newTimeConvention; }
    static set language(newLanguage) { applicationEffects.language = newLanguage; }
    static set theme(newTheme) { applicationEffects.theme = newTheme; }
    static set mapType(newMapType) { applicationEffects.mapType = newMapType; }
}

export { State }; 