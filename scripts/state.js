import { firebaseApp } from "./config.js";

const STATE = Object.freeze({
    initialLoad: 0, 
    ADD: 1, 
    DELETE: 2, 
})

let GLOBALSTATE = {  
    proxy: "https://cors-anywhere.herokuapp.com/",  
    db: firebaseApp.firestore().collection("locations"), 
    measure: "imperial", 
    pair: undefined, 
    today: undefined,
    flag: undefined, 
    locations: 0, 
    locationStorage: localStorage,
    status: null, 
    currentLocationHover: null,
    relPath: window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1, window.location.pathname.length)
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export { 
    GLOBALSTATE, 
    STATE, 
    days 
}; 