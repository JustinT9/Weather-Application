class WeatherSettings {
    constructor() {
        this.displaySetting = false;
    }

    displaySettings() {
        const settingsComponent = document.createElement("div");
        settingsComponent.className = "settingsComponent";
        
        const settingsElement = document.querySelector(".fa-gear");
        const onSettingsComponentDrag = (e) => {
            const settingsStyle = window.getComputedStyle(settingsComponent);
            const [dx, dy] = [e.movementX, e.movementY]; 
            const [left, top] = [parseInt(settingsStyle.left), parseInt(settingsStyle.top)]; 
            
            settingsComponent.style.left = `${left+dx}px`; 
            settingsComponent.style.top = `${top+dy}px`; 
        };
        
        settingsElement.addEventListener("click", () => {
            const applicationContainer = document.body; 
            this.displaySetting ? 
                (() => {
                    this.displaySetting = false;
                    ["mousedown", "mouseup"].forEach(type => settingsComponent.removeEventListener(type, () => {
                        settingsComponent.removeEventListener("mousemove", onSettingsComponentDrag); 
                    })); 
                    applicationContainer.removeChild(settingsComponent);
                })() : 
                (() => {
                    this.displaySetting = true;
                    settingsComponent.addEventListener("mousedown", () => {
                        settingsComponent.addEventListener("mousemove", onSettingsComponentDrag); 
                    }); 
                    settingsComponent.addEventListener("mouseup", () => {
                        settingsComponent.removeEventListener("mousemove", onSettingsComponentDrag); 
                    }); 
                    applicationContainer.appendChild(settingsComponent);
                })(); 
        })
    }; 
};

export { WeatherSettings }; 