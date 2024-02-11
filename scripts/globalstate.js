import { firebaseApp } from "./config.js";

let GLOBALSTATE = {   
    relPath: window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1, window.location.pathname.length), 
    pair: undefined, 
    today: undefined, 
    measure: "imperial", 
    flag: undefined, 
    locations: 0, 
    db: firebaseApp.firestore().collection("locations"), 
    locationStorage: localStorage,
    proxy: "https://cors-anywhere.herokuapp.com/"
};
 

export { GLOBALSTATE }; 