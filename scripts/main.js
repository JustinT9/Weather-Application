import { api_key } from "./config.js";
import { firebaseApp } from "./config.js"; 
import { GLOBALSTATE } from "./globalstate.js";
import { setIcon } from "./weather.js";

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
        const container           = document.querySelector(".container"); 
        const navbar              = document.querySelector(".navbar"); 
        const locationContainer  = document.createElement("div"); 
        const weatherContainer    = document.createElement("div"); 
        const searchWeatherForm   = document.createElement("form"); 
        const searchWeatherInput  = document.createElement("input"); 
        const locationDOMElements = getLocationStorage(); 

        locationContainer.className   = "locationContainer"; 
        weatherContainer.className     = "weatherContainer"
        searchWeatherForm.className    = "main-searchWeatherForm"; 
        searchWeatherInput.className   = "main-searchWeatherInput";
        searchWeatherInput.placeholder = "City, State...";  

        container.innerHTML          = navbar.outerHTML;
        searchWeatherForm.innerHTML  = searchWeatherInput.outerHTML; 
        locationContainer.innerHTML = searchWeatherForm.outerHTML;
        
        // must return Promise so it can wait upon this operation to complete synchronously
        return new Promise((resolve) => {
            locationDOMElements.forEach((location) => {
                const locationElement = new DOMParser().parseFromString(location, "text/xml").firstChild; 
                const city = locationElement.textContent.split(",")[0].trim(); 
                const state = locationElement.textContent.split(",")[1].trim(); 
                
                getLocation(city, state) 
                .then((res) => {
                    console.log("HERE2"); 
                    const rawTime         = res.currentTime.toLocaleTimeString(); 
                    const rawTimeLength   = rawTime.length; 
                    const parsedTime      = (rawTime.length % 2 === 0) ? 
                    (`${rawTime[0]}:${rawTime.substring(2, 4)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`) : 
                    (`${rawTime.substring(0, 2)}:${rawTime.substring(3, 5)} ${rawTime.substring(rawTimeLength-2, rawTimeLength)}`); 
                    const temperature     = Math.round(res.currentTemperature); 
                    const iconElement     = document.createElement("i"); 
                    setIcon(iconElement, res.weatherCondition);
                    iconElement.className = `${iconElement.className}`;  
                    
                    const locationElementContainer        = document.createElement("div"); 
                    const rightLocationElementSection     = document.createElement("div"); 
                    const leftLocationElementSection      = document.createElement("div"); 
                    const rightLocationElementSectionText = document.createElement("div");  
                    
                    const locationTextElement    = document.createElement("h2"); 
                    const timeTextElement        = document.createElement("h4");         
                    const temperatureTextElement = document.createElement("h1");
                    const deleteIcon              = document.createElement("i");              
                    locationTextElement.textContent    = `${city}, ${state}`; 
                    timeTextElement.textContent        = `${parsedTime}`; 
                    temperatureTextElement.textContent = (GLOBALSTATE.measure === "imperial") ? 
                    temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "F" : 
                    temperatureTextElement.textContent = `${temperature}` + "\u00b0" + "C";

                    deleteIcon.className                      = "fa-solid fa-xmark"; 
                    locationElementContainer.className        = "locationElement"; 
                    rightLocationElementSection.className     = "rightLocationElementSection"; 
                    leftLocationElementSection.className      = "leftLocationElementSection";  
                    rightLocationElementSectionText.className = "rightLocationsElementSectionText";  
                    
                    rightLocationElementSectionText.appendChild(locationTextElement); 
                    rightLocationElementSectionText.appendChild(timeTextElement); 
                    rightLocationElementSection.appendChild(iconElement); 
                    rightLocationElementSection.appendChild(rightLocationElementSectionText);                     
                    leftLocationElementSection.appendChild(temperatureTextElement); 
                    leftLocationElementSection.appendChild(deleteIcon); 
                    
                    locationElementContainer.appendChild(rightLocationElementSection); 
                    locationElementContainer.appendChild(leftLocationElementSection); 
                    locationContainer.appendChild(locationElementContainer); 
                    
                    container.innerHTML += locationContainer.outerHTML;
                    container.innerHTML += weatherContainer.outerHTML; 
                    
                    resolve(1); 
                }).catch((err) => console.log(err));  
            });
        })
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
        }).catch((err) => console.log(err));        
}; 

// helper function to retrieve data about a location to display 
const getLocation = (city, state) => {
    const query = GLOBALSTATE.db 
        .where("city", "==", city)
        .where("state", "==", state); 

    return query.get() 
        .then((res) => {
            const currentTime        = new Date(); 
            const weatherCondition   = res.docs[0].data().currentWeather.weather[0].description;
            const currentTemperature = res.docs[0].data().currentWeather.main.temp;  
            return { 
                currentTime: currentTime, 
                weatherCondition: weatherCondition,
                currentTemperature: currentTemperature, 
            }; 
        }).catch((err) => console.log(err)); 
}; 

const getLocationStorage = () => {
    let allLocations; 
    if (GLOBALSTATE.locationStorage.getItem("locations") === null) allLocations = []; 
    else allLocations = JSON.parse(GLOBALSTATE.locationStorage.getItem("locations"));
    return allLocations; 
}

const getCurrentWeather = (lat, lon) => {
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${GLOBALSTATE.measure}`;
    return fetch(GLOBALSTATE.proxy + weatherEndpoint, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
        }
    }).then((res) => {
        return res.json(); 
    }).then((data) => {
        return data; 
    }).catch((err) => console.log(err)); 
}; 

/*
    =======Schema=======
    whenFetched: date 
    city: string 
    state: string
    latitude: int
    longtitude: int  
    currentWeather: openweatherAPI json 
    dailyForecast: openweatherAPI json 
    weeklyForecast: openweatherAPI json 
*/
const addToDatabase = (city, state) => {
    const locationEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state}, US&appid=${api_key}`; 
    // fetch location

    return new Promise((resolve) => {fetch(GLOBALSTATE.proxy + locationEndpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        const lat = data[0].lat; 
        const lon = data[0].lon; 
        // fetch currentWeatherData to initialize the document within the collection of the firestore database 
        return new Promise((resolve) => { 
            getCurrentWeather(lat, lon)
                .then((currentWeatherData) => {
                    // add to db 
                    GLOBALSTATE.db.add({
                        city: city, 
                        state: state, 
                        latitude: lat, 
                        longtitude: lon, 
                        currentWeather: currentWeatherData
                    })
                    .then(res => {
                        console.log("WRITTEN TO", res.id);
                        return new Promise((resolve) => resolve(1)); 
                    })
                    .catch(err => console.error("ERROR", err)); 
                }).catch((err) => console.log(err)); 
            resolve(1);
            })
        }).catch((err) => console.log(err)); 
        resolve(1); 
    })
}; 

// store it within the localStorage and because storage updates, then reload the DOM 
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
            .then(async(res) => {
                if (res) {
                    await addToDatabase(city, state); 
                    saveLocations(city, state); 
                } else console.log("already exists"); 
            })
        } locationElement.value = ""; 
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
    } else inputLocation(".main-searchWeatherForm", ".main-searchWeatherInput"); 
}; 

const deleteFromDatabase = (city, state) => {
    const query = GLOBALSTATE.db
                    .where("city", "==", city)
                    .where("state", "==", state); 

    query.get()
        .then((data) => {
            data.forEach((res) => {
                res.ref.delete(); 
                console.log(`Location ${city}, ${state} successfully deleted.`);  
            })
        })
        .catch((err) => console.log(err)); 
}; 

const deleteFromLocalStorage = (city, state) => {
    const locationsStorage = getLocationStorage(); 

    const newLocationsStorage = 
        locationsStorage.filter((location) => {
            const locationDOMElement  = new DOMParser().parseFromString(location, "text/xml");
            const locationTextContent = locationDOMElement.firstChild.textContent; 
            const cityText = locationTextContent.split(",")[0].trim();
            const stateText = locationTextContent.split(",")[1].trim();

            return city !== cityText && state !== stateText; 
        });

    GLOBALSTATE.locationStorage.setItem("locations", JSON.stringify(newLocationsStorage));
};

const deleteLocation = () => {
    const deleteIconElement = document.querySelector(".leftLocationElementSection i"); 

    deleteIconElement.addEventListener("click", () => {
        const location = deleteIconElement
                            .parentElement
                            .parentElement
                            .firstChild
                            .querySelector(":nth-child(2)")
                            .querySelector(":nth-child(1)")
                            .textContent;
                            
        const parsedLocation = location.split(","); 
        const city           = parsedLocation[0].trim(); 
        const state          = parsedLocation[1].trim();  
        
        deleteFromDatabase(city, state);
        deleteFromLocalStorage(city, state);
        GLOBALSTATE.locations -= 1; 
        loadPage(); 
    });
};  

// to make sure if there are locations the accurate number of locations are 
// accounted for within the db for when they first load into the UI 
const countLocations = () => {
    return firebaseApp.firestore().collection("locations").get()
        .then((res) => {
            return res.docs.length;  
        }); 
}; 

window.addEventListener("load", () => {
    countLocations().then(async(res) => {
        GLOBALSTATE.locations = res; 
        if (!GLOBALSTATE.locations) {
            loadPage(); 
            addLocation(); 
            deleteLocation(); 
        } else {
            await loadPage(); 
            addLocation();
            deleteLocation();  
        }
        console.log(GLOBALSTATE.locations); 
    }) 
});