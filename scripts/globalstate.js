let GLOBALSTATE = {   
    relPath: window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1, window.location.pathname.length), 
    pair: undefined, 
    today: undefined, 
    measure: "imperial", 
    flag: undefined, 
    locations: false, 
    relationName: "locations"
}; 

export { GLOBALSTATE }; 