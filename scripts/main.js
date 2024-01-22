import { api_key } from "./config.js";
import { firebaseApp } from "./config.js"; 
import { GLOBALSTATE } from "./globalstate.js";
import { todayWeather } from "./mockdata.js"; 

const loadWeather = () => {

}; 

const loadPage = () => {
    if (!GLOBALSTATE.locations) {
        const container     = document.querySelector(".container"); 
        const initContainer = document.createElement("div"); 
        const btn           = document.createElement("button"); 

        initContainer.className = "initialLocationContainer"; 
        btn.className           = "main-addLocation";
        btn.innerHTML           = "<i class='fa-solid fa-plus addIcon'></i>Add Location"; 

        initContainer.appendChild(btn); 
        container.appendChild(initContainer); 

    } else {    
        const container          = document.querySelector(".container"); 
        const navbar             = document.querySelector(".navbar"); 
        const locationsContainer = document.createElement("div"); 
        const weatherContainer   = document.createElement("div"); 
        const searchWeatherForm  = document.createElement("form"); 
        const searchWeatherInput = document.createElement("input"); 
        const locationsElements  = getLocationStorage(); 

        locationsContainer.className   = "locationsContainer"; 
        weatherContainer.className     = "weatherContainer"
        searchWeatherForm.className    = "main-searchWeatherForm"; 
        searchWeatherInput.className   = "main-searchWeatherInput";
        searchWeatherInput.placeholder = "City, State...";  

        container.innerHTML          = navbar.outerHTML;
        searchWeatherForm.innerHTML  = searchWeatherInput.outerHTML; 
        locationsContainer.innerHTML = searchWeatherForm.outerHTML;
        locationsElements.forEach((location) => {
            locationsContainer.innerHTML += location;
        }); 
        container.innerHTML += locationsContainer.outerHTML; 
        container.innerHTML += weatherContainer.outerHTML; 
    }
};

// verify if the location exists within the database or not 
// by querying the fields 
const doesLocationExist = (city, state) => {
    const query = GLOBALSTATE.db
        .where("city", "==", city)
        .where("state", "==", state);

    // return the booleans and return that promise which will be called through another 
    // with this function 
    return query.get()
        .then((doc) => {
            return doc.empty; 
        })
        .catch((err) => console.log(err));        
}; 

const getLocationStorage = () => {
    let allLocations; 

    if (GLOBALSTATE.locationStorage.getItem("locations") === null) {
        allLocations = []; 
    } else {
        allLocations = JSON.parse(GLOBALSTATE.locationStorage.getItem("locations"));
    }

    return allLocations; 
}

// store it within the localStorage 
const saveLocations = (city, state) => {    
    if (!GLOBALSTATE.locations) {
        const initContainer   = document.querySelector(".initialLocationContainer"); 
        const locationElement = document.createElement("div"); 

        // styling 
        locationElement.className   = "locationsElement"; 
        locationElement.textContent = `${city}, ${state}`; 

        // delete the old UI and add the new UI for the locations being existent 
        initContainer.remove(); 

        // save it within local storage 
        const allLocations = getLocationStorage(); 
        
        allLocations.push(locationElement.outerHTML); 
        GLOBALSTATE.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
        GLOBALSTATE.locations += 1; 

        loadPage(); 
    } else {
        const locationElement = document.createElement("div"); 

        locationElement.className = "locationsElement"; 
        locationElement.textContent = `${city} ${state}`;

        const allLocations = getLocationStorage(); 

        allLocations.push(locationElement.outerHTML); 
        GLOBALSTATE.locationStorage.setItem("locations", JSON.stringify(allLocations)); 
        GLOBALSTATE.locations += 1; 

        loadPage(); 
    }
}; 

/*
    Schema
    city: string 
    state: string 
*/
const addToDatabase = (city, state) => {
    GLOBALSTATE.db.add({
        city: city, 
        state: state
    })
        .then(res => console.log("WRITTEN TO", res.id))
        .catch(err => console.error("ERROR", err)); 
}; 

// to make if there are locations the accurate number of locations are 
// accounted for within the db for when they first load into the UI 
const countLocations = () => {
    return firebaseApp.firestore().collection("locations").get()
        .then((res) => {
            return res.docs.length;  
        })
}; 

// now handle the input 
const inputLocation = (formClassname, inputClassname) => {
    const formElement = document.querySelector(formClassname); 

    formElement.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const locationElement = document.querySelector(inputClassname); 

        // parsing matters now with the user input with location 
        // if not City, State format 
        if (locationElement.value.indexOf(",") === -1) {
            
        } else {
            const parsedLocation = locationElement.value.split(","); 
            const city           = parsedLocation[0]; 
            const state          = parsedLocation[1].trim(); 

            // once parsed use the data to add it to the data 
            
            // if empty then add otherwise do nothing since it is already within the database
            doesLocationExist(city, state)
            .then((res) => {
                if (res) {
                    addToDatabase(city, state); 
                    saveLocations(city, state); 
                } else {
                    console.log("already exists"); 
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
            const parentElement = document.querySelector(".initialLocationContainer");  
            const formElement   = document.createElement("form"); 
            const inputElement  = document.createElement("input");
            
            formElement.className    = "main-inputWrapper"; 
            inputElement.className   = "main-inputLocation"; 
            inputElement.placeholder = "City, State..."; 

            btnElement.remove();
            formElement.appendChild(inputElement); 
            parentElement.appendChild(formElement); 
            
            // now handle the input 
            inputLocation("." + formElement.className, "." + inputElement.className); 
        }); 
    // if there is at least one location within the db then check if it is already 
    // within the database then do nothing otherwise add it 
    } else {    
        inputLocation(".main-searchWeatherForm", ".main-searchWeatherInput"); 
    }
}; 

window.addEventListener("load", () => {
    countLocations().then((res) => {
        GLOBALSTATE.locations = res; 
        
        loadPage(); 
        addLocation();
        console.log("NUM LOCATIONS", GLOBALSTATE.locations);
    }) 
})


