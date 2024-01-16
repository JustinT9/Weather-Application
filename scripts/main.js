import { firebaseApp } from "./config.js"; 
import { GLOBALSTATE } from "./globalstate.js";

const db = firebaseApp.firestore();

// verify if the location exists within the database or not 
// by querying the fields 
const locationsExist = (city, state) => {
    const locationsRef = db.collection("locations"); 
    const query        = locationsRef.where("city", "==", city).where("state", "==", state);

    // return the booleans and return that promise which will be called through another 
    // with this function 
    return query.get()
        .then((doc) => {
            return doc.empty; 
        })
        .catch((err) => console.log(err));        
}; 

const getLocations = () => {
    const locationsRef = db.collection("locations"); 

    console.log(locationsRef); 
}; 

/*
    Schema
    city: string 
    state: string 
*/
const addToDatabase = (city, state) => {
    db.collection(GLOBALSTATE.relationName).add({
        city: city, 
        state: state
    })
        .then(res => console.log("WRITTEN TO", res.id))
        .catch(err => console.error("ERROR", err)); 
}; 

const removeFromDatabase = (city, state) => {

}; 


// now handle the input 
const inputLocation = (elementClassname) => {
    const formElement = document.querySelector(elementClassname); 

    formElement.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const locationElement = document.querySelector(".main-inputLocation"); 

        // parsing matters now with the user input with location 
        // if not City, State format 
        if (locationElement.value.indexOf(",") === -1) {
            
        } else {
            const parsedLocation = locationElement.value.split(","); 
            const city           = parsedLocation[0]; 
            const state          = parsedLocation[1].trim(); 

            // once parsed use the data to add it to the data 
            
            // if empty then add otherwise do nothing since it is already within the database
            locationsExist(city, state)
                .then((res) => {
                    if (res) {
                        addToDatabase(city, state); 
                    }
                })
        }   
        locationElement.value = ""; 
    })
};

const addLocation = () => {
    // if there are no current locations for weather then initialize 
    if (!GLOBALSTATE.locations) {
        const btnElement = document.querySelector(".main-addLocation");  

        // click on the add btn to input the first location 
        btnElement.addEventListener("click", () => {
            const parentElement = document.querySelector(".no-locations");  
            const formElement   = document.createElement("form"); 
            const inputElement  = document.createElement("input");
            
            formElement.className    = "main-inputWrapper"; 
            inputElement.className   = "main-inputLocation"; 
            inputElement.placeholder = "City, State..."; 
            GLOBALSTATE.locations    = true; 

            btnElement.remove();
            formElement.appendChild(inputElement); 
            parentElement.appendChild(formElement); 
            
            // now handle the input 
            inputLocation("." + formElement.className); 
        }); 
    // if there is at least one location within the db then check if it is already 
    // within the database then do nothing otherwise add it 
    } else {
        
    }
}; 

const init = () => {
    // addLocation();
    getLocations();  
};  

init(); 

console.log("NOW IN", GLOBALSTATE.relPath); 
